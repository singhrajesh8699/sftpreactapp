import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-flexbox-grid';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import { withStyles } from 'material-ui/styles';
import {Link} from 'react-router-dom';
import ExpandLess from 'material-ui-icons/ExpandLess';
import ExpandMore from 'material-ui-icons/ExpandMore';
import Collapse from 'material-ui/transitions/Collapse';
import classNames from 'classnames';
import styles from '../../AppTheme';
import Divider from 'material-ui/Divider';
import Home from 'material-ui-icons/Home';
import FileUpload from 'material-ui-icons/FileUpload';
import Dashboard from 'material-ui-icons/Dashboard';
import InsertChart from 'material-ui-icons/InsertChart';
import Tooltip from 'material-ui/Tooltip';

class NavBarList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      open:false,
    };
  }
 
   handleClick = () => {
    this.setState({ open: !this.state.open });
  };

  render() {
     const { classes, theme } = this.props;
    return (
      <List className={classes.list}>
          <ListItem button component={Link} to="/home">
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText inset primary="Home" />
          </ListItem>
          <Divider />
          <ListItem button component={Link} to="/uploadfile">
            <ListItemIcon>
              <FileUpload />
            </ListItemIcon>
            <ListItemText inset primary="Upload File" />
          </ListItem>
          <Divider />
          <ListItem button component={Link} to="/report" >
            <ListItemIcon>
            <InsertChart />
            </ListItemIcon>
            <ListItemText primary="Report" />
          </ListItem>
      </List>
    );
  }
}

NavBarList.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

//export default NavBarList;

export default withStyles(styles, { withTheme: true })(NavBarList);
