import React from 'react';
import Paper from 'material-ui/Paper';
import {bindActionCreators} from 'redux';
import {connect, ReactRedux} from 'react-redux';
import {salesForceData,sendSalesForceData,authlogin} from '../../Actions/SalesForce/salesForceAction';
import { Scrollbars } from 'react-custom-scrollbars';
import TextField from 'material-ui/TextField';
import { MenuItem } from 'material-ui/Menu';
import Button from 'material-ui/Button';
import Input, { InputLabel } from 'material-ui/Input';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import styles from '../AppTheme';
import Divider from 'material-ui/Divider';


class Eloqua extends React.Component{

  constructor(props) {
    super(props);
    this.state = {CId:'',CSk:''};
  }
  componentDidMount(){
  	
  } 
  componentWillReceiveProps(nextProps){
   
  }

  handleOnClick(){
    var CId =document.getElementById('CId').value;
    var CSk=document.getElementById('CSk').value;
    this.setState({CId:CId,CSk:CSk}); 
  } 

  handleOnSubmit(){
    var userId=localStorage.getItem('userId');
    var userName=localStorage.getItem('username')
    var CId=this.state.CId;
    var CSk=this.state.CSk;
    var serverdata={userId:userId,userName:userName,CId:CId,CSk:CSk};
        this.props.authlogin('Eloqua',serverdata).then(function(resolve){
          var win=window.open(resolve,'_blank',
             'toolbar=yes,scrollbars=yes,resizable=yes,top=300,left=500,width=600,height=500');
        })
        .catch(function(error){
            console.log(error)
        });
  }

	render(){
		var self=this;
    

    return(
       <Paper elevation={4} style={styles.paper}>
        <Toolbar>
         <Typography type="headline" component="h3">
            Eloqua
         </Typography>
         <Button raised color="primary" style={{position:"relative",left:'5%'}}
                onClick={self.handleOnSubmit.bind(self,'Eloqua')}>Submit</Button>
        </Toolbar>
        <Divider />
       </Paper>
	  )
	}
}

function mapStatetoProps(store) {
    return {
      salesforce: store.SalesForce
    }
};

function mapDispatchToProps(dispatch) {
 return bindActionCreators({salesForceData,sendSalesForceData,authlogin}, dispatch);
 
}

export default connect(mapStatetoProps, mapDispatchToProps)(Eloqua);