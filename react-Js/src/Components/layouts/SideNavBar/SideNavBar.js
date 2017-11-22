
import React from 'react';
import {connect, ReactRedux} from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import Menu, { MenuItem } from 'material-ui/Menu';
import MoreVert from 'material-ui-icons/MoreVert';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import ChevronRightIcon from 'material-ui-icons/ChevronRight';
import NavBarList from './NavBarList.js'
import styles from '../../AppTheme';
import {grey500,grey700, white,red300} from 'material-ui/colors';
import axios from "axios";
import properties from '../../../Containers/Utils/const'
import Person from 'material-ui-icons/Person';
import SwitchAcount from 'material-ui-icons/SwapVert';
import SwitchUser from './SwitchUser';


class SideNavBar extends React.Component {
  state = {
    open: false,
    menuopen2:false,
    anchorEl2: null,
    switchuser:'',
  };

  static contextTypes = {
    router: PropTypes.object
  }

  componentWillMount(){
  
  }

  handleMenuIcon2=event=>{
    this.setState({ menuopen2: true, anchorEl2: event.currentTarget });
  };

  handleRequestClose2 = () => {
    this.setState({ menuopen2: false });
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  switchuser(user){
    console.log(user)
    this.setState({switchuser:user.cname});
  };

  handleRegister(){
    axios.post(properties.renderSignUpUrl,JSON.stringify({username:localStorage.getItem('username')}),
      {
        headers:{
          "Content-Type":"application/json",
          "Authorization":localStorage.getItem('jwtToken'),
          }
      }).then((result)=>
      {
        if(result.data.allow){
           this.context.router.history.push('/register');
         }else{
          alert('you are not authorize to access this page')
         }
      }).catch((err)=>
      {  
         console.log(err)
      })
  }; 

  handleSignOut(){
       localStorage.removeItem("userId");
       localStorage.removeItem("username");
       localStorage.removeItem("email");
       localStorage.removeItem("cname");
       localStorage.removeItem("roles");
       localStorage.removeItem("jwtToken");
       this.context.router.history.push('/login');
  };

  render() {
    var self=this;
    const { classes, theme } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <AppBar className={classNames(classes.appBar, self.state.open && classes.appBarShift)}>
            <Toolbar disableGutters={!self.state.open}>
                <IconButton
                  color="contrast"
                  aria-label="open drawer"
                  onClick={self.handleDrawerOpen}
                  className={classNames(classes.menuButton, self.state.open && classes.hide)}
                >
                 <MenuIcon />
                </IconButton>
                <Typography type="title" color="inherit" className={classes.flex}>
                </Typography>

              {localStorage.getItem('roles')==='admin'?
                <SwitchUser  switchuser={self.switchuser.bind(self)}/>: null}

                <span className={classes.headerAdM}>
                <Person />
                <label className={classes.headerAdmin}>{localStorage.getItem('cname')+'('+
                                    localStorage.getItem('roles')+')'}</label>
                </span>
                
                <IconButton
                  aria-label="More"
                  aria-owns={self.state.menuopen2 ? 'simple-menu' : null}
                  aria-haspopup="true"
                  onClick={self.handleMenuIcon2}
                >
                  <MoreVert/>
                </IconButton>
                <Menu
                  id="simple-menu"
                  anchorEl={self.state.anchorEl2}
                  open={self.state.menuopen2}
                  onRequestClose={self.handleRequestClose2}
                >
                  <MenuItem onClick={self.handleRegister.bind(self)}>Register</MenuItem>
                  <MenuItem onClick={self.handleSignOut.bind(self)}>Sign Out</MenuItem>
                </Menu>
            </Toolbar>
          </AppBar>
          <Drawer
            type="permanent"
            classes={{
              paper: classNames(classes.drawerPaper, !self.state.open && classes.drawerPaperClose),
            }}
            open={self.state.open}
            >
            <div className={classes.drawerInner}>
               <Divider />
              <div className={classes.drawerHeader}>
                <Typography type="title" color="inherit" noWrap>
                  ZTCDM WEB APP
                </Typography>
                <IconButton onClick={self.handleDrawerClose}>
                  {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
              </div>
              <Divider />
                <NavBarList />
              <Divider />
            </div>
          </Drawer>
          <main className={classes.content}>
            <Typography type="body1">
               {self.props.children}
            </Typography>
          </main>
        </div>
      </div>
    );
  }
}

SideNavBar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  children: PropTypes.arrayOf(PropTypes.element),
};

//export default withStyles(styles, { withTheme: true })(SideNavBar);

function mapStatetoProps(store) {
    return {
      login: store.Login,
    }
};

export default withStyles(styles, { withTheme: true })  (SideNavBar);
