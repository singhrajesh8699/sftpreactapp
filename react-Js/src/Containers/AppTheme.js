import {createMuiTheme} from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import {white,blue600,grey500, grey900,grey600,grey800,black,blue500,grey300} from 'material-ui/colors';

const AppTheme = createMuiTheme({
  palette: {},
  appBar: {
    height: 57,
    color: blue600
  },
  drawer: {
    width: 230,
    color: grey900
  },
  raisedButton: {
    primaryColor: blue600,
  },

   charGap:{
    paddingTop: 5,
  },

/****************************login****************************************/

  loginContainer: {
      minWidth: 320,
      maxWidth: 400,
      height: 'auto',
      position: 'absolute',
      top: '20%',
      left: 0,
      right: 0,
      margin: 'auto'
    },
    Lpaper: {
      padding: 20,
      overflow: 'auto'
    },
    buttonsDiv: {
      textAlign: 'center',
      padding: 10
    },
    flatButton: {
      color: grey500
    },
    checkRemember: {
      style: {
        float: 'left',
        maxWidth: 180,
        paddingTop: 5
      },
      labelStyle: {
        color: grey500
      },
      iconStyle: {
        color: grey500,
        borderColor: grey500,
        fill: grey500
      }
    },
    loginBtn: {
      float: 'right'
    },
    btn: {
      background: '#4f81e9',
      color: white,
      padding: 7,
      borderRadius: 2,
      margin: 2,
      fontSize: 13
    },
    btnFacebook: {
      background: '#4f81e9'
    },
    btnGoogle: {
      background: '#e14441'
    },
    btnSpan: {
      marginLeft: 5
    },
 
   forget:{
     position:'relative',
    'textDecoration':'underline',
    'textDecorationColor': 'red',
    'cursor': 'pointer','color':'grey'
   },

/************************Common*******************************************/
 textField:{
    marginTop:20
 },

  inkBarStyle:{
    backgroundColor:blue500,
    height:5,
    position:"relative",
    bottom:3
  },
  tabs: {
    width: 200,
    float: 'left' 
  },

 scroll:{
    height:460,
    overflowY:scroll,
  },

  backgroundColor:{
    backgroundColor:white
  },

  chartTitle:{
   color:black,
   textTransform: "uppercase"
  },
   

   marginTop:{
    "marginTop":10
  },
  navigation: {
    fontSize: 15,
    fontWeight: 400,
    color: grey600,
    paddingBottom: 15,
    display: 'block',
    float:"right",
    marginRight: 36
    
  },
  title:{
    fontWeight: 700,
    color: "#666",
    float: "left",
    width: "auto",
    margin: 0,
    padding: 0,
    fontSize: 20,
    opacity: .9,
    textTransform: "uppercase"
  },
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  slide: {
    padding: 10,

  },
  swipeable: {
    clear: 'left',
    paddingTop: 10,
  },
  grid: {
    paddingLeft: 5,
  },

paper:{
  height:window.innerHeight-130,
  padding:10,
  marginRight:10,
  marginLeft:10,
  overflowX: 'auto',
},

margin:{
  marginLeft:62,
  marginRight:58,
  marginTop:20,
},

textValidation:{
  color: 'red',
  fontSize: 'small'
},

/******************************Home***************************************************************/
HTHeader:{
  backgroundColor:grey300
},
 HTfont:{
  fontWieght:600,
  fontSize:'medium',
  textAlign:'left',
 },

/*************************************************************************************************/
  fbtransition:{
    '-webkit-transition': 'width 2s',
    transition: 'width 2s',
  },
    

/****************************salesforce***********************************************************/
smargin:{
  marginLeft:65,
  marginTop:20,
  width:1160, 
  height:window.innerHeight-85,
  paddingLeft:70,
  paddingRight:70,

},
scardpadding:{
  paddingTop:10,
  paddingBpttom:5
},

/*************************************************S3************************************************/
s3margin1:{
  padding:10,
  height:(window.innerHeight-150)/3,
  overflow: 'auto',
  width:'100%',
},
s3margin2:{
  padding:10,
  height:2*(window.innerHeight-125)/3,
  overflow: 'auto',
  width:'100%',
},
 

innerFileInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },

  s3root: {
    flexGrow: 1,
  }
});


export default AppTheme;