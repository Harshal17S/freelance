import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    CircularProgress,
    Dialog,
    DialogTitle,
    TextField,
    Typography,
    Divider,
    Grid,
    InputAdornment,
    MenuItem,
    Paper,
} from '@material-ui/core';
import { useStyles } from '../styles';
import { Store } from '../Store';
import axios from "axios";
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@material-ui/icons/VisibilityOffOutlined';
import { ToastContainer, toast } from '../components/Toast';
import  {
    USER_SIGNUP,
    USER_SIGNUP_SUCCESS,
    USER_SIGNUP_FAIL,
    USER_SIGNIN,  
    USER_SIGNIN_SUCCESS, 
    USER_SIGNIN_FAIL,
} from '../constants';
import config, { getParameterByName, merchantCode } from '../util';
import {GoogleOAuthProvider , GoogleLogin } from '@react-oauth/google';

// OTP countdown hook
const useOtpCountdown = (initialTime = 120) => {
    const [timer, setTimer] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const intervalRef = useRef(null);
  
    const startCountdown = () => {
        // Clear any existing interval first
        if (intervalRef.current) clearInterval(intervalRef.current);
        
        setTimer(initialTime);
        setIsActive(true);
    };
  
    useEffect(() => {
        if (isActive) {
            intervalRef.current = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        clearInterval(intervalRef.current);
                        setIsActive(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        
        // Cleanup on component unmount or when isActive changes
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isActive]);
  
    const resetCountdown = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setTimer(0);
        setIsActive(false);
    };
  
    return {
        timer,
        isActive,
        startCountdown,
        resetCountdown,
    };
};

const SignUp = (props) => {
    const styles = useStyles();
    const { state, dispatch } = useContext(Store);
    const [showPass, setShowPass] = useState(false);
    let { userInfo } = state.userData;
    const [conShowPass, setConShowPass] = useState(false);
    const [pass1, setPass1] = useState(false);
    const [Signin, setSign] = useState(false);

    const [singUpFirstName, setSignUpFirstName] = useState("");
    const [signUpLastName, setSignUpLastName] = useState("");
    const [signUpEmail, setSignUpEmail] = useState("");
    const [singUpNumber, setSignUpNumber] = useState("");
    const [signUpAddress, setSignUpAdress] = useState("");
    const [singUpPassword, setSignUpPassword] = useState("");
    const [singUpConPassword, setSignUpConPassword] = useState("");
    const themeColor = userInfo?.themeColor || '#ffbc01';  
    const themeTxtColor = userInfo?.themeTxtColor || '#000'; 
    const [signInEmail, setSignInEmail] = useState("");
    const [singInPasswprd, setSignInPassword] = useState("");
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    
    // Enhanced input handling from second file
    const [isEmail, setIsEmail] = useState(true);
    const [countryCode, setCountryCode] = useState('+91');

    // New OTP related states
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [isSendingOTP,setOTPSending]=useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const { timer, isActive, startCountdown, resetCountdown } = useOtpCountdown();

    // Add the loginAsGuest function to fix the undefined error
    const loginAsGuest = () => {
        return dispatch({
            type: USER_SIGNIN_SUCCESS,
            payload: { firstName: 'Guest' },
        });
    }
    
    const handleInputChange = (e) => {
        const val = e.target.value;
        setSignInEmail(val);
        setIsEmail(isNaN(val));
    };

    // Enhanced Google login success handler (combined from both files)
    const handleGoogleSuccess = async (credentialResponse) => {
        console.log(credentialResponse);
        if (!credentialResponse.credential) {
            toast.error("Google authentication failed!");
            return;
        }
        
        setIsGoogleLoading(true);
        
        try {
            // Decode ID token (JWT)
            const token = credentialResponse.credential;
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            console.log(decodedToken);
            
            // Support both API endpoints used in the different files
            let response;
            
            try {
                decodedToken.firstName= decodedToken.given_name;
                decodedToken.lastName= decodedToken.family_name;
                decodedToken.isEmailVerified=true;
                decodedToken.smedialoginProvider='Google';

                // First try the original endpoint
                response = await axios.post(`${config.authapi}/customer/authenticate`, { 
                    googleData: decodedToken,
                    token,
                    merchantCode
                });
            } catch (err) {
                // If that fails, try the alternate endpoint from second file
                response = await axios.post(`${config.authapi}/customer/google-auth`, {
                    token,
                    merchantCode,
                });
            }
            
            dispatch({
                type: USER_SIGNIN_SUCCESS,
                payload: response.data.user,
            });
            
            sessionStorage.setItem("customerInfo", JSON.stringify(response.data.user));
             if(window.NativeInterface && response.data.user.token){
                    window.NativeInterface.saveToken(response.data.user.token)
                }
            props.setOpenSign(false);
            props.procedToCheckoutHandler();
            setIsVerifyingOtp(false);
            setOtpSent(false);
            resetCountdown();
        } catch (error) {
            console.error("Google Auth Error:", error);
            toast.error("Google authentication failed: " + 
                (error.response?.data?.message || error.message));
            
            dispatch({
                type: USER_SIGNIN_FAIL,
                payload: error.message,
            });
        } finally {
            setIsGoogleLoading(false);
        }
    };

    // Handle Google login error
    const handleGoogleError = () => {
        toast.error("Google sign in was unsuccessful. Please try again.");
        setIsGoogleLoading(false);
    };

    // Enhanced OTP handler supporting both email and phone
    const getOtpHandler = async () => {
        setOTPSending(true);
        const email = signInEmail;
        if (!email) {
            toast.error("Please enter your email/phone");
            return;
        }
        
        try {
            dispatch({ type: USER_SIGNIN });
            
            // Support both email and phone number authentication
            const payload = isEmail
                ? { email: signInEmail, merchantCode }
                : { phone: countryCode + signInEmail, merchantCode };
                
            const response = await axios.post(`${config.authapi}/customer/authenticate`, payload);
            
            setOtpSent(true);
            startCountdown();
            setOTPSending(false);

            toast.success(`OTP sent to your ${isEmail ? 'email' : 'phone'}`);
        } catch (error) {
            console.error("OTP sending failed:", error);
            toast.error("OTP sending failed. Please try again later");
            dispatch({
                type: USER_SIGNIN_FAIL,
                payload: error.message,
            });
        }
    };
    
    const verifyOtpHandler = async () => {
        if (otp.length !== 4) {
            toast.error("Please enter a valid 4-digit OTP");
            return;
        }
        
        try {
            setIsVerifyingOtp(true);
            
            // Support both email and phone validation
            const payload = isEmail
                ? { email: signInEmail, otp, merchantCode }
                : { phone: countryCode + signInEmail, otp, merchantCode };
                
            const response = await axios.post(`${config.authapi}/customer/validate-otp`, payload);
            
            if(response && response.data.user){
                dispatch({
                    type: USER_SIGNIN_SUCCESS,
                    payload: response.data.user,
                });
                sessionStorage.setItem("customerInfo", JSON.stringify(response.data.user));
                if(window.NativeInterface && response.data.user.token){
                    window.NativeInterface.saveToken(response.data.user.token)
                }
                props.setOpenSign(false);
                props.procedToCheckoutHandler();
                setIsVerifyingOtp(false);
                setOtpSent(false);
                resetCountdown();
            }
        } catch (error) {
            console.error("OTP verification failed:", error);
            toast.error("OTP verification failed. Please try again.");
            setIsVerifyingOtp(false);
            dispatch({
                type: Signin ? USER_SIGNUP_FAIL : USER_SIGNIN_FAIL,
                payload: error.message,
            });
        }
    };
    
    const handleChangeEmail = () => {
        setOtpSent(false);
        resetCountdown();
        setOtp("");
    };
    
    const handleOtpChange = (e) => {
        const newOtp = e.target.value;
        // Only allow digits
        if (/^\d*$/.test(newOtp) && newOtp.length <= 4) {
            setOtp(newOtp);
        }
    };

    // Username/password authentication (kept for backward compatibility)
    const userSingnIn = async () => {
        dispatch({type:USER_SIGNIN});
        if(signInEmail){
            console.log(signInEmail,singInPasswprd);
            const email=signInEmail;
            const password =singInPasswprd
            try{
                const {data}= await axios.post(`${config.authapi}/customer/authenticate`, {email,password});
                data?props.setOpenSign(false):console.log("hello");
                data?sessionStorage.setItem("customerInfo",JSON.stringify(data)):console.log("hello");
                 if(window.NativeInterface && data.token){
                    window.NativeInterface.saveToken(data.token)
                }
                dispatch({
                    type: USER_SIGNIN_SUCCESS,
                    payload:data,
                });
                toast.success("Login successful!");
                props.procedToCheckoutHandler();
                return;
            }
            catch(error){
                toast.error("Login failed: Details are not correct!");
                return dispatch({
                    type:USER_SIGNIN_FAIL,
                    payload:error.message,
                });
            }
        } else {
            toast.error("Please enter email and password");
        }
    }

    return(
        <Box className={styles.root} style={{ height:"auto", width: '100%', alignItems: 'center', overflow:"auto",overflowX:"hidden", padding: "20px", borderRadius: "12px",backgroundColor:"#ede3bb"}}>

            {!Signin && !otpSent && (
                <div style={{width:"100%"}} id="input_sign">
                    <Typography variant="h4" align="center" gutterBottom style={{marginBottom: "20px"}}>
                        Log In
                    </Typography>
                    
                    <TextField 
                        label="Email or Phone number"
                        fullWidth
                        required
                        variant="outlined"
                        margin="normal"
                        value={signInEmail}
                        onChange={handleInputChange}
                        style={{fontSize:"1.2em",fontWeight:"bold"}}
                        InputProps={!isEmail && {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <TextField
                                        select
                                        value={countryCode}
                                        onChange={(e) => setCountryCode(e.target.value)}
                                        style={{ width: 70, fontSize:"1.2em",fontWeight:"bold"}}
                                    >
                                        <MenuItem value="+91">+91</MenuItem>
                                        <MenuItem value="+1">+1</MenuItem>
                                        <MenuItem value="+44">+44</MenuItem>
                                    </TextField>
                                </InputAdornment>
                            )
                        }}
                    />
                    
                    <Grid container spacing={2} style={{marginTop: "15px"}}>
                        <Grid item xs={12}>
                            <Button 
                                variant="contained" 
                                color="primary"
                                disabled={isSendingOTP}
                                fullWidth
                                onClick={getOtpHandler}
                                style={{backgroundColor: "#2d3795", color: "#fff", borderRadius: "50px", padding: "10px"}}
                            >
                                Get OTP
                            </Button>
                        </Grid>
                    </Grid>
                    
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        width="100%"
                        my={3}
                    >
                        <Divider style={{width: '40%'}} />
                        <Typography variant="h6" style={{margin: "0 10px"}}>
                            OR
                        </Typography>
                        <Divider style={{width: '40%'}} />
                    </Box>
                    
                    <div style={{display:"flex", justifyContent:"center", margin:"10px"}}>
                        {isGoogleLoading ? (
                            <CircularProgress size={24} style={{color: "#4285F4"}} />
                        ) : (
                            <div style={{ maxWidth: '340px', fontSize:'1.2em', fontWeight:"bold"}}>
                                <GoogleOAuthProvider clientId="20661248742-cjc0h0oe53jv5tda1nbva58f6fp1tib5.apps.googleusercontent.com">
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={handleGoogleError}
                                        text={"LogIn"}
                                        shape="rectangular"
                                        logo_alignment="center"
                                        width="100%"
                                    />
                                </GoogleOAuthProvider>
                            </div>
                        )}
                    </div>
                    
                    <div style={{display:"flex", justifyContent:"center", marginTop:"20px",display:"none"}}>
                        <Button 
                            onClick={() => props.setOpenSign(false)}
                            style={{color: 'red', backgroundColor: 'transparent', border: 'none', fontWeight: "bold"}}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            )}
            
            {/* OTP Verification Screen */}
            {otpSent && (
                <div id="input_otp" style={{width:"100%"}}>
                    <Typography variant="h4" align="center" gutterBottom>
                        {Signin ? "Verify Email" : "Login"}
                    </Typography>
                    
                    <Typography variant="body1" align="center" paragraph>
                        We've sent an OTP to {isEmail ? signInEmail : countryCode + signInEmail}
                    </Typography>
                    
                    <Box textAlign="center" mt={2}>
                        <TextField 
                            label="Enter 4-digit OTP"
                            fullWidth
                            required
                            variant="outlined"
                            margin="normal"
                            value={otp}
                            onChange={handleOtpChange}
                            inputProps={{ maxLength: 4, pattern: "[0-9]*" }}
                            style={{maxWidth: "250px", margin: "10 auto 20px", fontSize:"1.2em"}}
                        />
                        
                        <Typography variant="body2" color="primary" style={{padding: '8px 0'}}>
                            {timer === 0 ? (
                                <Button
                                    onClick={getOtpHandler}
                                    variant="text"
                                    color="primary"
                                    style={{textTransform: 'none'}}
                                >
                                    Click here to resend OTP
                                </Button>
                            ) : (
                                `Resend OTP in ${timer} seconds`
                            )}
                        </Typography>
                    </Box>
                    
                    <Box textAlign="center" mt={2}>
                        <Button
                            onClick={verifyOtpHandler}
                            variant="contained"
                            color="primary"
                            disabled={isVerifyingOtp || otp.length !== 4}
                            style={{width: "60%", padding: "10px", backgroundColor: "#2d3795"}}
                        >
                            {isVerifyingOtp ? <CircularProgress size={24} style={{color: "#fff"}} /> : "Verify OTP"}
                        </Button>
                    </Box>
                    
                    <Box textAlign="center" mt={2}>
                        <Button
                            onClick={handleChangeEmail}
                            variant="text"
                            color="primary"
                            style={{textTransform: 'none'}}
                        >
                            Change Email/Phone
                        </Button>
                    </Box>
                </div>
            )}
        </Box>
    );
};

export default SignUp;