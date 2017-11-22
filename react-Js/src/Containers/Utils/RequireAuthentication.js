import React from 'react';
import PropTypes from 'prop-types';
import {connect, ReactRedux} from 'react-redux';
import {bindActionCreators} from 'redux';
import {addFlashMessage} from '../../Actions/Login/loginAction';

export default function(ComposedComponent){
  class Authenticate extends React.Component{
  	constructor(props) {
     super(props);
    }
  	static contextTypes = {
        router: PropTypes.object
    }
  	componentWillMount(){
  		if(localStorage.getItem('userId')==null || localStorage.getItem('userId')==undefined)
  		{  
  		  this.props.addFlashMessage("You need to be logged in to access this page!");
        this.context.router.history.push('/login');
  		}
  	}
	render(){
	  return(
		<ComposedComponent {...this.props} />
	  ) 
	}
  }
function mapStatetoProps(store) {
    return {
      login: store.Login,
    }
};

function mapDispatchToProps(dispatch) {
 return bindActionCreators({addFlashMessage}, dispatch);
 
}

return connect(mapStatetoProps, mapDispatchToProps)(Authenticate);
}
