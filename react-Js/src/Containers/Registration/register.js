import React from 'react';
import {connect, ReactRedux} from 'react-redux';
import {bindActionCreators} from 'redux';
import {registerData,sendRegistrationData,
        validateUserName,validateEmail,validateCName} from '../../Actions/Registration/registrationAction';
import { ScaleLoader } from 'react-spinners';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import { MenuItem } from 'material-ui/Menu';
import Button from 'material-ui/Button';
import {red300} from 'material-ui/colors';
import Select from 'material-ui/Select';
import { FormControl, FormHelperText } from 'material-ui/Form';
import { Scrollbars } from 'react-custom-scrollbars';
import Input, { InputLabel } from 'material-ui/Input';
import Typography from 'material-ui/Typography';
import styles from '../AppTheme';

class Register extends React.Component{

  constructor(props) {
    super(props);
    this.state = {cname:"",username:"",password:"",confirmpwd:"",email:"",
    insert:false,showLoading:false,uniquser:true,uniqemail:true,value:'client'};

    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.handleUserName=this.handleUserName.bind(this);
    this.handleEmail=this.handleEmail.bind(this);
  }
  componentDidMount(){
    if(this.props.register.data!=null){
      this.setState({name:this.props.register.data.name,
         username:this.props.register.data.username,
         password:this.props.register.data.password,
         confirmpwd:this.props.register.data.confirmpwd,
         email:this.props.register.data.email,
              })
    }
  } 
  componentWillReceiveProps(nextProps){
    if(nextProps.register.data){
      this.setState({name:nextProps.register.data.name,
         username:nextProps.register.data.username,
         password:nextProps.register.data.password,
         confirmpwd:nextProps.register.data.confirmpwd,
         email:nextProps.register.data.email,
              })
    }
  } 

  restrictCNM(e){
    const re = /[0-9a-zA-Z_\s]+/g;
    if (!re.test(e.key)) {
      e.preventDefault();
      alert('special characters not allow')
    }
  }

  restrictUNM(e){
    const re = /[0-9a-zA-Z_]+/g;
    if (!re.test(e.key)) {
      e.preventDefault();
      alert('special characters not allow')
    }
  }

  handleOnClick(){
  	var cname =document.getElementById('CNm').value;
  	var username=document.getElementById('UNm').value;
  	var password=document.getElementById('Pwd').value;
  	var confirmpwd=document.getElementById('Cpwd').value;
    var email=document.getElementById('Email').value;

    this.setState({cname:cname,
    	             username:username,
    	             password:password,
                   confirmpwd:confirmpwd,
                   email:email,
    	            },function(){
    	            	this.props.registerData(this.state);
    	            }); 
	}

  handleClientName(){
    if(this.state.cname!=''){
      this.props.validateCName(this.state);
    }
  }

  handleUserName(){
   if(this.state.username!=''){
     this.props.validateUserName(this.state);
   }
  }

  handleEmail(){
   if(this.state.email!=''){
    this.props.validateEmail(this.state);
   } 
  }
   
  handleSelectChange(e){
    this.setState({value:e.target.value});
  }

  handleOnSubmit(){
    if(this.state.cname!='' && this.state.username!='' && this.state.password!='' 
       && this.state.confirmpwd!='' && this.state.email!=''){
     if(this.props.register.data.uniquser && this.props.register.data.uniqemail){
       this.setState({showLoading:true})
       this.props.sendRegistrationData(this.state);
    }else{
      alert('clientname or username or email id already exist')
    }
  }else{
    alert('Please fill out all mandatory fields')
  }   
 }

 passwordMatch(){
  if(this.state.password && this.state.confirmpwd && this.state.password==this.state.confirmpwd && 
    this.state.password.length>=6 && this.state.confirmpwd.length>=6){
       return(<div>password match</div>)
   }else if(this.state.password!==this.state.confirmpwd && this.state.password.length>=6 && this.state.confirmpwd.length>=6){
    return (<div>password not match</div>)
   }
 }

 userValidation(){
  if(this.state.username.length<4 && this.state.username){
    return(<div style={styles.textValidation}>username contains atleast four character</div>)
  }
 }

 passwordValidation(){
   if(this.state.password.length<6 && this.state.password){
    return(<div style={styles.textValidation}>password contains atleast six digits</div>)
  }
 }

 cpasswordValidation(){
   if(this.state.confirmpwd.length<6 && this.state.confirmpwd){
    return(<div style={styles.textValidation}>password contains atleast six digits</div>)
  }
 }


	render(){
		var self=this;

    return(
     
       <Paper elevation={4} style={styles.paper}>
         <Typography type="headline" component="h3">
            Registration
         </Typography>

         <TextField
          label="Client Name"  style={styles.textField} onKeyPress={self.restrictCNM.bind(self)}
          placeholder="Client Name"  fullWidth={true} value={self.state.name} 
          id="CNm" onChange={self.handleOnClick} onBlur={self.handleClientName.bind(self)}/> <br/>
		
		    <TextField
	       label="User Name"  style={styles.textField} onKeyPress={self.restrictUNM.bind(self)}
	       placeholder="User Name"  fullWidth={true}
	       value={self.state.username}
         id="UNm" onChange={self.handleOnClick} onBlur={self.handleUserName}/> <br />
          {!self.state.uniquser?
           <div style={{color:red300}}>user name already exist.</div>  
           :null}
           {self.userValidation()}   
        
        <TextField
         label="Password"  style={styles.textField}
         placeholder="Password"  fullWidth={true}
         value={self.state.password}
         type="password"
         id="Pwd" onChange={self.handleOnClick}/> <br />
        {self.passwordValidation()}

        <TextField
         label="Confirm Password" style={styles.textField}
         placeholder="Confirm Password"  fullWidth={true}
         value={self.state.confirmpwd}
         type="password"
         id="Cpwd" onChange={self.handleOnClick}/> <br />  
         {self.passwordMatch()}
         {self.cpasswordValidation()}

        <TextField
         label="Email"  style={styles.textField}
         placeholder="Email"  fullWidth={true}
         value={self.state.email}
         id="Email" onChange={self.handleOnClick} onBlur={self.handleEmail}/> <br />
          {!self.state.uniqemail? 
           <div style={{color:red300}}>email id already exist.</div>  
           :null}  

           <Select value={self.state.value} style={{width:150,marginTop:30}} 
            onChange={self.handleSelectChange.bind(self)}>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem  value="client">Client</MenuItem>
           </Select>
         
          <div style={{float:'right',marginTop:30}}>
           <Button raised color="primary"
                  onClick={self.handleOnSubmit.bind(self)}>Submit</Button>
          </div>
          <div style={{float:'right',marginTop:40,paddingRight:20}}>
           {self.state.showLoading? 
            self.props.register.fetching?
             <ScaleLoader color={'#123abc'} 
             loading={self.state.fetching} />
            :<label>User record inserted successfully.</label>:null} 
           </div>
	      </Paper>
	  )
	}
}

function mapStatetoProps(store) {
    return {
      register: store.Registration,
    }
};

function mapDispatchToProps(dispatch) {
 return bindActionCreators({registerData,sendRegistrationData,validateUserName,
        validateEmail,validateCName}, dispatch);
 
}

export default connect(mapStatetoProps, mapDispatchToProps)(Register);