import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    TextField,
    Typography,
    Divider,
    Grid,
    InputAdornment,
    MenuItem,
} from '@material-ui/core';
import { useStyles } from '../styles';
import { Store } from '../Store';
import axios from "axios";
import { toast } from '../components/Toast';
import {
    USER_SIGNIN,  
    USER_SIGNIN_SUCCESS, 
    USER_SIGNIN_FAIL,
} from '../constants';
import config, { merchantCode } from '../util';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import Logo from '../assets/image/cofee.png';

// OTP countdown hook
const useOtpCountdown = (initialTime = 120) => {
    const [timer, setTimer] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const intervalRef = useRef(null);
  
    const startCountdown = () => {
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
        startCountdown,
        resetCountdown,
    };
};

const SignUp = (props) => {
    const styles = useStyles();
    const { state, dispatch } = useContext(Store);
    let { userInfo } = state.userData;
    const [Signin] = useState(false);
    const [signInEmail, setSignInEmail] = useState("");
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    
    const [isEmail, setIsEmail] = useState(true);
    const [countryCode, setCountryCode] = useState('+91');
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [isSendingOTP, setOTPSending] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const { timer, startCountdown, resetCountdown } = useOtpCountdown();

    const handleInputChange = (e) => {
        const val = e.target.value;
        setSignInEmail(val);
        setIsEmail(isNaN(val));
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        if (!credentialResponse.credential) {
            toast.error("Google authentication failed!");
            return;
        }
        
        setIsGoogleLoading(true);
        
        try {
            const token = credentialResponse.credential;
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            
            decodedToken.firstName = decodedToken.given_name;
            decodedToken.lastName = decodedToken.family_name;
            decodedToken.isEmailVerified = true;

            let response;
            try {
                response = await axios.post(`${config.authapi}/customer/authenticate`, { 
                    googleData: decodedToken,
                    token,
                    merchantCode
                });
            } catch (err) {
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
            if (window.NativeInterface && response.data.user.token) {
                window.NativeInterface.saveToken(response.data.user.token);
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

    const handleGoogleError = () => {
        toast.error("Google sign in was unsuccessful. Please try again.");
        setIsGoogleLoading(false);
    };

    const getOtpHandler = async () => {
        setOTPSending(true);
        const email = signInEmail;
        if (!email) {
            toast.error("Please enter your email/phone");
            return;
        }
        
        try {
            dispatch({ type: USER_SIGNIN });
            
            const payload = isEmail
                ? { email: signInEmail, merchantCode }
                : { phone: countryCode + signInEmail, merchantCode };
                
            await axios.post(`${config.authapi}/customer/authenticate`, payload);
            
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
            
            const payload = isEmail
                ? { email: signInEmail, otp, merchantCode }
                : { phone: countryCode + signInEmail, otp, merchantCode };
                
            const response = await axios.post(`${config.authapi}/customer/validate-otp`, payload);
            
            if (response && response.data.user) {
                dispatch({
                    type: USER_SIGNIN_SUCCESS,
                    payload: response.data.user,
                });
                sessionStorage.setItem("customerInfo", JSON.stringify(response.data.user));
                if (window.NativeInterface && response.data.user.token) {
                    window.NativeInterface.saveToken(response.data.user.token);
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
                type: Signin ? USER_SIGNIN_FAIL : USER_SIGNIN_FAIL,
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
        if (/^\d*$/.test(newOtp) && newOtp.length <= 4) {
            setOtp(newOtp);
        }
    };

    return (
        <Box
            className={styles.root}
            style={{
                height: "auto",
                width: '100%',
                alignItems: 'center',
                overflow: "auto",
                overflowX: "hidden",
                padding: "20px",
                borderRadius: "12px",
                backgroundColor: "#1a1a1a", // Dark background from the previous theme
                color: "#fff", // White text for contrast
                position: "relative",
            }}
        >
            {/* Coffee Cup Logo */}
            <Box
                display="flex"
                justifyContent="center"
                mb={2}
            >
                <img
                    src={Logo} // Path to the logo from asset folder
                    alt="Coffee Logo"
                    style={{
                        width: "130px",
                        height: "100px",
                    }}
                />
            </Box>

            {!otpSent && (
                <div style={{ width: "100%" }} id="input_sign">
                    <Typography
                        variant="h4"
                        align="center"
                        gutterBottom
                        style={{
                            marginBottom: "20px",
                            color: "#fff",
                            fontWeight: "bold",
                            fontFamily: "'Playfair Display', serif",
                        }}
                    >
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
                        style={{
                            fontSize: "1.2em",
                            fontWeight: "normal",
                            backgroundColor: "#2a2a2a", // Darker input background
                            borderRadius: "8px",
                        }}
                        InputLabelProps={{
                            style: { color: "#fff" },
                            fontWeight:"bold"
                             // Gold label color
                        }}
                        InputProps={{
                            style: { color: "#fff", fontSize:"0.8em",fontWeight:"normal" },  // White text
                            ...(!isEmail && {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <TextField
                                            select
                                            value={countryCode}
                                            onChange={(e) => setCountryCode(e.target.value)}
                                            style={{
                                                width: 70,
                                                fontSize: "1.2em",
                                                fontWeight: "normal",
                                                backgroundColor: "#2a2a2a",
                                            }}
                                            InputProps={{
                                                style: { color: "#fff" },
                                            }}
                                        >
                                            <MenuItem value="+91">+91</MenuItem>
                                            <MenuItem value="+1">+1</MenuItem>
                                            <MenuItem value="+44">+44</MenuItem>
                                        </TextField>
                                    </InputAdornment>
                                ),
                            }),
                        }}
                    />

                    <Grid container spacing={2} style={{ marginTop: "15px" }}>
                        <Grid item xs={12}>
                            <Button 
                                variant="contained"
                                disabled={isSendingOTP}
                                fullWidth
                                onClick={getOtpHandler}
                                style={{
                                    backgroundColor: "#654321", // Gold button
                                    color: "#fff", // Black text for contrast
                                    borderRadius: "50px", // Rounded edges to match the new design
                                    padding: "10px",
                                    fontWeight: "bold",
                                    textTransform: "uppercase",
                                }}
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
                        <Divider style={{ width: '40%', backgroundColor: "#654321" }} />
                        <Typography
                            variant="h6"
                            style={{
                                margin: "0 10px",
                                color: "#654321",
                            }}
                        >
                            OR
                        </Typography>
                        <Divider style={{ width: '40%', backgroundColor: "#654321" }} />
                    </Box>
                    
                    <Box
                        display="flex"
                        justifyContent="center"
                        mb={2}
                    >
                        {isGoogleLoading ? (
                            <CircularProgress size={24} style={{ color: "#654321" }} />
                        ) : (
                            <div style={{ maxWidth: '340px', fontSize: '1.2em', fontWeight: "bold" }}>
                                <GoogleOAuthProvider clientId="20661248742-cjc0h0oe53jv5tda1nbva58f6fp1tib5.apps.googleusercontent.com">
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={handleGoogleError}
                                        text="Sign in with Google"
                                        shape="rectangular"
                                        logo_alignment="left"
                                        width="100%"
                                    />
                                </GoogleOAuthProvider>
                            </div>
                        )}
                    </Box>
                </div>
            )}
            
            {/* OTP Verification Screen */}
            {otpSent && (
                <div id="input_otp" style={{ width: "100%" }}>
                    <Typography
                        variant="h4"
                        align="center"
                        gutterBottom
                        style={{
                            color: "#fff",
                            fontWeight: "bold",
                        }}
                    >
                        Log In
                    </Typography>
                    
                    <Typography
                        variant="body1"
                        align="center"
                        paragraph
                        style={{ color: "#fff" }}
                    >
                        We've sent an OTP to "{isEmail ? signInEmail : countryCode + signInEmail}"
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
                            style={{
                                maxWidth: "200px",
                                margin: "10 auto 20px",
                                fontSize: "0.8em",
                                backgroundColor: "#2a2a2a",
                                borderRadius: "8px",
                            }}
                            InputLabelProps={{
                                style: { color: "#fff" },
                            }}
                            InputProps={{
                                style: { color: "#fff", fontSize:"0.8em" },
                            }}
                        />
                        
                        <Typography
                            variant="body2"
                            style={{ color: "#654321", padding: '8px 0' }}
                        >
                            {timer === 0 ? (
                                <Button
                                    onClick={getOtpHandler}
                                    variant="text"
                                    style={{
                                        color: "#654321",
                                        textTransform: 'none',
                                    }}
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
                            disabled={isVerifyingOtp || otp.length !== 4}
                            style={{
                                width: "60%",
                                padding: "10px",
                                backgroundColor: "#654321",
                                color: "#fff",
                                borderRadius: "50px",
                                fontWeight: "bold",
                            }}
                        >
                            {isVerifyingOtp ? <CircularProgress size={24} style={{ color: "#000" }} /> : "Verify OTP"}
                        </Button>
                    </Box>
                    
                    <Box textAlign="center" mt={2}>
                        <Button
                            onClick={handleChangeEmail}
                            variant="text"
                            style={{
                                color: "#654321",
                                textTransform: 'none',
                            }}
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