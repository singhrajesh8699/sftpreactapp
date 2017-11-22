import React from 'react';
import PropTypes from 'prop-types';
import {connect, ReactRedux} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router-dom';
import { Grid, Row, Col } from 'react-flexbox-grid';
import {MuiThemeProvider} from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Checkbox from 'material-ui/Checkbox';
import Dialog, {DialogActions,DialogContent,DialogContentText,DialogTitle,} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import {grey500,grey700, white,red300} from 'material-ui/colors';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import AppTheme from '../AppTheme';
import {validateLoginData,addFlashMessage,updatePassword,getUserList} from '../../Actions/Login/loginAction';


class LoginPage extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {username:'',password:'',cpassword:'',open: false,};
  }
   
  handleOpen(){
    this.setState({open: true});
  }

  handleClose(){
    this.setState({open: false});
  }

  static contextTypes = {
    router: PropTypes.object
  }
 

handleLogin(){
  if(this.state.username!='' && this.state.password!=''){
    var self=this; 
    var loginData={username:this.state.username,password:this.state.password};
    this.props.validateLoginData(loginData).then(function(resolve){
      if(resolve.status=="success"){
        localStorage.setItem("userId",self.props.login.data.userId);
        localStorage.setItem("username",self.props.login.data.username);
        localStorage.setItem("email",self.props.login.data.email);
        localStorage.setItem("cname",self.props.login.data.cname);
        localStorage.setItem("roles",self.props.login.data.roles);
        localStorage.setItem("jwtToken",self.props.login.data.token);
        self.context.router.history.push('/home');
        if(self.props.login.data.roles==='admin'){
          self.props.getUserList(self.props.login.data.token);
         }
      }else{
        self.props.addFlashMessage("Invalid User Id or Password!");
        self.context.router.history.push('/login');
      }
    })
    .catch(function(reject){
      console.log(reject);
      alert(reject);
    })
  }else{
    alert('username and password should not be empty!')
  } 
}

updatePass(){
    var self=this;
  if(this.state.username!='' && this.state.password!=''){ 
    var newPass={username:self.state.username,password:self.state.password};
    self.props.updatePassword(newPass).then(function(resolve){
      if(resolve.status=="new user"){
        self.props.addFlashMessage("Invalid User Id or Email Id");
      }
      if(resolve.status=="passchanged"){
        self.props.addFlashMessage("Password reset. A verification link has been sent to your email \n"+localStorage.getItem('email'));
        self.setState({open: false});
      }
      if(resolve.status=="passfailed"){
        self.props.addFlashMessage("Password Not Updated! Technical Issue");
      }
    })
    .catch(function(reject){
        alert(reject);
    })
  }else{
    alert('username and password should not be empty!')
  } 
 }

passwordMatch(){
   if(this.state.password && this.state.cpassword && this.state.password==this.state.cpassword && 
    this.state.password.length>=6 && this.state.cpassword.length>=6){
       return(<div>password match</div>)
   }else if(this.state.password!==this.state.cpassword && this.state.password.length>=6 && this.state.cpassword.length>=6){
    return (<div>password not match</div>)
   }
 }

 userValidation(){
  if(this.state.username.length<4 && this.state.username){
    return(<div style={AppTheme.textValidation}>username contains atleast four character</div>)
  }
 }

 passwordValidation(){
   if(this.state.password.length<6 && this.state.password){
    return(<div style={AppTheme.textValidation}>password contains atleast six digits</div>)
  }
 }

 cpasswordValidation(){
   if(this.state.cpassword.length<6 && this.state.cpassword){
    return(<div style={AppTheme.textValidation}>password contains atleast six digits</div>)
  }
 }

 handleKeyPress = (e) => {
  if(e.key=='Enter')
    this.handleLogin;
}

render(){
  let self = this;
  
  /*var enterKey = document.getElementById("enterKey");
  enterKey.addEventListener("keydown", function (e) {
      if (e.keyCode === 13) {
          this.handleLogin(e);
      }
  });*/

  return (
    <MuiThemeProvider theme={AppTheme}>
      <div style={AppTheme.loginContainer}>
         <p style={{color:red300,fontSize:'small'}}>{self.props.login.message}</p>
          <Paper style={AppTheme.Lpaper} elevation={4}>

            <form>
              <TextField
                label="Username"
                placeholder="Username"
                fullWidth={true}
                value={self.state.username}
                onChange={e => self.setState({ username: e.target.value })}
              />
              {self.userValidation()}
              <TextField
                label="Password"
                placeholder="Password"
                fullWidth={true}
                type="password"
                value={self.state.password}
                onChange={e => self.setState({ password: e.target.value })}
              />
                {self.passwordValidation()}
              <Row>
               <Col md={7} sm={7}>
                <FormControlLabel control={<Checkbox value="checkedC" />} label="Remember me" />
                <p style={AppTheme.forget} onClick={self.handleOpen.bind(self)}>Forget Password</p>
               </Col>
                <Col md={5} sm={5} style={{position:'relative',top:15}}>
                  <Button  raised color="primary" id="enterKey" onClick={self.handleLogin.bind(self)}>
                  Login</Button>
                  
                </Col>
              </Row>
            </form>
          </Paper>

      <Dialog open={self.state.open} onRequestClose={self.handleClose.bind(self)}>
        <DialogTitle>Change your password here</DialogTitle>
          <DialogContent>
            <p style={{color:red300}}>{self.props.login.message}</p>
            <form>
              <TextField
                label="Username"
                placeholder="Username"
                fullWidth={true}
                value={self.state.username}
                onChange={e => self.setState({ username: e.target.value })}
              />
              {self.userValidation()}
              <TextField
                label="Password"
                placeholder="Password"
                fullWidth={true}
                type="password"
                value={self.state.password}
                onChange={e => self.setState({ password: e.target.value })}
              />
              {self.passwordValidation()}
              <TextField
                label="Confirm Password"
                placeholder="Confirm Password"
                fullWidth={true}
                type="password"
                value={self.state.cpassword}
                onChange={e => self.setState({ cpassword: e.target.value })}
              />
              {self.passwordMatch()}
              {self.cpasswordValidation()}
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={self.handleClose.bind(self)} color="primary">
              Cancel
            </Button>
            <Button onClick={self.updatePass.bind(self)} color="primary">
              Submit
            </Button>
          </DialogActions>
      </Dialog>
      
    </div>
    </MuiThemeProvider>
  );
 }
};

function mapStatetoProps(store) {
    return {
      login: store.Login,
    }
};

function mapDispatchToProps(dispatch) {
 return bindActionCreators({validateLoginData,addFlashMessage,
                            updatePassword,getUserList}, dispatch);
 
}

export default connect(mapStatetoProps, mapDispatchToProps)(LoginPage);

