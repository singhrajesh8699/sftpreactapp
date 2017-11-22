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


class Report extends React.Component{

  constructor(props) {
    super(props);
    this.state = {CId:'',CSk:''};
  }
  componentDidMount(){
  	
  } 
  componentWillReceiveProps(nextProps){
   
  }

	render(){
		var self=this;
    

    return(
       <Paper elevation={4} style={styles.paper}>
        Under Development
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

export default connect(mapStatetoProps, mapDispatchToProps)(Report);