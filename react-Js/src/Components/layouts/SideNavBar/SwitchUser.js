import React from 'react';
import PropTypes from 'prop-types';
import {connect, ReactRedux} from 'react-redux';
import {bindActionCreators} from 'redux';
import {validateLoginData,addFlashMessage,
        updatePassword,getUserList} from '../../../Actions/Login/loginAction';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import Menu, { MenuItem } from 'material-ui/Menu';
import SwitchAcount from 'material-ui-icons/SwapVert';


class SwitchUser extends React.Component {
  
  state = {
    open: false,
    menuopen1:false,
    anchorEl1: null,
    switchuser:'',
  };

  static contextTypes = {
    router: PropTypes.object
  }

  componentWillMount(){
  
  }

  handleMenuIcon1=event=>{
    this.setState({ menuopen1: true, anchorEl1: event.currentTarget });
  };

  handleRequestClose1 = () => {
    this.setState({ menuopen1: false });
  };

  switchUser(user){
    this.setState({switchuser:user.cname});
    this.props.switchuser(user);
    localStorage.setItem('switchuser',JSON.stringify(user));
  }

render(){
  let self = this;
  var userList=[];
  if(!this.props.login.fetching){
    userList=this.props.login.userList;
  }
  return (
    <div>
     <span style={{position:'relative',bottom:'8px',fontWeight: 700,'textTransform': 'capitalize'}}>{self.state.switchuser}</span>
      <IconButton
        aria-label="More"
        aria-owns={self.state.menuopen1 ? 'simple-menu' : null}
        aria-haspopup="true"
        onClick={self.handleMenuIcon1}
      >
        <SwitchAcount />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={self.state.anchorEl1}
        open={self.state.menuopen1}
        onRequestClose={self.handleRequestClose1}
      >
      {userList.map(function(user){
      return(
        <MenuItem onClick={self.switchUser.bind(self,user)}>{user.cname}</MenuItem>
       )})}
      </Menu> 
    </div>
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

export default connect(mapStatetoProps, mapDispatchToProps)(SwitchUser);

