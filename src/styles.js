import { makeStyles } from '@material-ui/core';
import { Hidden } from '@mui/material';



export const useStyles = makeStyles((theme) => ({

	
	// Common
	root: {
		// backgroundImage: 'url(/images/bg-1.jpeg)',
		// backgroundRepeat: 'repeat',
		// backgroundPosition: 'center',
		fontFamily: 'Acme !important',
		// backgroundSize:'cover',

		// width:"100%",
		height: '100vh',
		display: 'flex',
		flexDirection: 'column'
	
	},
	promoImg: {
		width:'100%',
		height:'100%'
	},
	root1: {
		// backgroundImage: 'url(/images/bg-1.jpeg)',
		// backgroundRepeat: 'repeat',
		// backgroundPosition: 'center',
		// backgroundSize:'cover',

		// width:"100%",
		height: '100vh',
		display: 'flex',
		flexDirection: 'column',
		margin: 0,
	},
	center: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection:'column',
		fontSize:'1.2em',
	},
	centerWithScroll: {
		display: 'block',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection:'column',
		fontSize:'1.2em',
		overflowX:'hidden',
		overflow:'scroll',
		height: 'calc(100vh - 150px)'

	},
	centerAutoFit: {
		display: 'block',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection:'column',
		fontSize:'1.2em',
		marginBottom:'10px'
	},
	fixHeight: {
		
		height: 'auto!important'

	},
	column: { flexDirection: 'column' },
	main: {
		flex: 1,
		overflow: 'auto !important',
		overflowX: 'hidden',
		flexDirection: 'column',
		display: 'flex',
		// color: '#000000',
		textAlign: 'center',
		border: 3,
		
	},
	timer: {
		fontSize: '30px',
		color: '#e51111',
		position: 'absolute',
		width: '100%',
		textAlign: 'center',
	},
	timerSize: {
		margin: '5px',
		color: 'red',
		fontWeight: '10px',
	},

	orderAgainBtn: {

		borderRadius: '50px',
		width: '300px',
		height: '45px',
		fontSize: 30,
		backgroundColor:"#ffbc01 !important",
		color:"black !important"
	},
	main1: {
		// flex: 1,
		// overflow: 'auto',
		// overflowX: 'hidden',
		// flexDirection: 'column',
		display: 'flex',
		color: '#000000',
		textAlign: 'center',
		border: 3,
		// marginBottom:"0px",
	},
	// navy: {
	// 	backgroundColor: '#003080',
	// },
	green: {
		backgroundColor: '#ff04044d',
	},
	footer: {
		// border:"2px solid #00e6f1 ",
		borderRadius: '50px',
		fontSize: "60px",


	},
	// choose screen
	cards: {
		display: 'flex',
		justifyContent: "space-around",
		alignItems: 'center',
		border:"none !important"


	},
	itemsCenter:{
		alignItems:"center",
		verticalAlign:"center"
	},
	// order screen
	// red: {
	// 	backgroundColor: '#ff2040',
	// 	color: '#ffffff',
	// },
	bordered: {
		width: "90%",
		backgroundColor: "#000",
		borderWidth: 2,
		borderRadius: 5,
		color: 'white',
		margin: 5,
		borderStyle: 'Dash',
		fontSize: "20px",
		display:"grid",
		placeItem:"center"
		// height:"20px"
		

	},
	row: {
		display: 'flex',
		padding:"2px"
		

	},
	space: {
		padding: 10,
		// paddingBottom: 25
	},
	around: {
		justifyContent: 'space-around',
		marginBottom:"10px",
		
	},
	between: {
		justifyContent: 'space-between',
	},
	
	content:{
		justifyContent: 'space-evenly',
	},
	largeBtnColor: {
		backgroundColor: "black !important",

	},
	largeButton: {
		border: "2px solid  ",
		borderRadius: '50px !important',
		width: '238px',
		height: '45px',
		fontSize: "20px",
		backgroundColor: "#000 important",
		marginRight:"10px!important"

	},
	AddlargeButton:{
		border: "2px solid  ",
		borderRadius: '50px !important',
		width: '238px',
		height: '45px',
		fontSize: "20px",
		backgroundColor: "white !important",
	},
	rightlargeButton:{
		border: "2px solid  ",
		borderRadius: '50px !important',
		width: '238px',
		height: '45px',
		fontSize: "20px",
		backgroundColor: "black !important",
		color:"white !important"
	},
	largeNumber: {
		margin: '35px'
	},
	notes:{
		display:'block',
		width:"100%"

	},
	editBtn: {
		border: "2px solid  ",
		borderRadius: '50px',
	},

	vegBtn: {
		// position:'absolute',
		// right:'40px',
		// top:13,

		color: '#0d4016',

	},

	veg_img: {
		position: 'absolute',
		top: 15,
		right: 10,
	},

	catTitleBox: {
		margin: 0,
		marginBottom:"-10px",
	},

	largeInput: {
		width: '60px!important',
		padding: '0!important',
		fontSize: '35px!important',
		textAlign: 'center!important',
		margin: '18px',

	},

	orderNum: {
		fontSize: '55px!important',
		color: "green",
	},

	logo: {
		height: 50,
	},
	largeLogo: {
		height: 100,
	},
	title: {
		marginTop: 5,
		fontSize: '2rem',
		fontWeight: 400,
		// backgroundColor:'#d9c7c7',
		// color: "#911818",

	},

	title3: {
		// color: '#8d241e',
		fontSize: "30px",
		height: "50px!important"
		
	},
	order: {
		display:"flex"
	},
	title1: {
		marginTop: 5,
		// color: "#0400f1",
	},
	title2: { color: "#c73737",marginBottom:"0px",fontSize:"50px" },
	card: {
		margin: 5,
		// backgroundColor: "#fcf6f6b8",
		border:'none !important',
		boxShadow: "none",
		// width:"250px",
		// height:"307px",
		borderRadius:"5px",
		backgroundColor: "#D3D3D3 !important",
		
	},
	cardd:{
		margin: 5,
	
		// backgroundColor: "#fcf6f6b8",
		border:'none !important',
		boxShadow: "none",
		// width:"250px",
		// height:"307px",
		borderRadius:"5px",
		backgroundColor: "#FFF !important",
	},
	media: { 
		
		 maxHeight: "180px",
		 borderRadius:"5px"
		 
		},
		mediaSmall:{
			width: "190px",
		 height: "200px",
		 borderRadius:"10px",
		 paddingTop:"5px"
		},
		mediaMd: { 
		width: "340px",
		 height: "170px",
		 paddingTop:"0px"
		},
	foot:{
		padding:"8px"
	},
	qr_img: {
		margin: 'auto',
		height: '100%',
		width: 'auto',
		padding: '20px',
	},
	qrCode: {

		height: '100%',
		width: 'auto'
	},
	qrTitle: {
		fontSize: '3em',
		textAlign: 'center',
		marginTop: '133px',
		marginBottom: '30px',
		background: '#ffffff52',
	},
	qrCodeGen: {
		height: "auto",
		margin: "0 auto",
		maxWidth: 500,
		padding: "10px",
		background: '#ffffff',
		width: "100%"
	},
	ready: {
		backgroundColor: '#003080',
		color: '#ffffff',
		marginTop: 0,
	},
	processing: {
		backgroundColor: '#404040',
		color: '#ffffff',
		marginTop: 0,
	},
	// Signin/Signup
	paper: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
	categoryContainer: {
		display: 'block',
		padding: '5px',	
		width:"auto",
		whiteSpace: 'nowrap',
		overflowX: 'auto',
		background: '#edecec61',
		marginBottom: "0px",
		marginTop: "0px",

		height:"10% !important",
		
	},
	cont:{
		display: 'flex',
		padding: '5px',	
		width:"auto",
		whiteSpace: 'nowrap',
		marginBottom:"10px",
		overflow:"auto" 
	},
	
	categoryItem: {
		display: 'inline-block',
		// marginLeft: '22px',
		textAlign: 'center',
		fontSize: '20px',
		marginTop:"10px",

		
	},
	image: {

		width: '50px',
		height: '50px',
		borderRadius: '50px',
		cursor: "pointer",

	},
	imageHolder: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: '50px',
		textAlign: 'center',
		fontSize: '15px',
		padding: '5px',
		marginBottom:"5px"
		
	},
	btnHolder:{
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: "auto",
		height: 'auto',
		marginLeft: '22px',
		textAlign: 'center',
		fontSize: '20px',
		backgroundColor: '#fff',
		borderRadius: '20px',
		padding: '10px 20px',
		marginBottom:"10px",
		backgroundColor:"black",
		color:"white"
	},
	countHolder:{
		flexDirection:"row !important",
		height:"90px"
	},
	minus: {
		margin: '50px',
		backgroundColor:"black !important",
		borderRadius:"20px"

	},
	add: {
		margin: '50px',
		backgroundColor:"black !important",
		borderRadius:"20px"

	},
	token_sele: {
		float: 'right',
		marginRight: 80,
		marginTop: -30,
	},
	sendBtn: {

		border: "2px solid #00e6f1 ",
		borderRadius: '50px',
		display:"inline-block",
		padding:"0px 52px"
	},

	invoice: {
		backgroundColor: 'whitesmoke',
		borderRadius: '8px',
		display:"inline-block",
		overflowy:"scroll"
	},
	screen: {
		float: 'right',
		marginTop: '15px',
		marginBottom: "223px",
		width: "483px",

		borderRadius: '5px',
		fontSize: "30px"
	},

	editCard: {
		marginTop: '-5px',
	},

	cardFooter: {
		display: 'flex',
		justifyContent: 'space-around',
		alignItems: 'center',
		padding:"0px",
	    fontSize:"20px",
		fontFamily:"Arial",
		color:"black"
		
	},
	prod_title: {
		textOverflow: 'ellipsis',
		lineHeight:1,
		marginBottom:"0px",
		color: '#000000',

	},
	reviwText: {
		color: '#0c0c0d',
		marginBottom:"0px",
		fontSize:"1.2em!important"
		
	},
	prod_cal: {
		color: '#352a22',
		marginLeft: '-10px',
	},
	prod_cal1: { color: '#352a22', },
	minus1:{
		height:35,
		width:60,
		borderRadius:'50px',
		margin:2,
		color:"white",
		background:"black !important",
		textAlign:"center",
		border:"none",
	},
	plus:{
		height:35,
		width:60,
		borderRadius:'50px',
		margin:2,
		color:"white",
		background:"green",
		textAlign:"center",
		border:"none",
	},
	btn_group:{
		width:"40%",
		display:"flex",
		justifyContent:"space-between",
		alignItems:"center",
		flexWrap:"nowrap",
	},
	addons:{
		width:"75%",
		display:"flex",
		justifyContent:"space-between",
		alignItems:"center",
		flexWrap:"nowrap",
		flexDirection:"row"
	},
	greenTrack: {
		backgroundColor: '#4CAF50 !important',
		opacity: 0.5,
	},
	greenThumb: {
		backgroundColor: '#4CAF50 !important',
	},

}));
