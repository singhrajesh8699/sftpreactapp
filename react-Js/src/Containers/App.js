import React from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { render } from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import AppTheme from './AppTheme';
import LoginPage from './LoginPage/LoginPage';
import SideNavBar from '../Components/layouts/SideNavBar/SideNavBar'
import UploadFile from './UploadFile';
import RegistrationPage from './Registration/register'
import Home from './HomePage/Home';
import Report from './Report/Report.js';
import { Provider } from 'react-redux';
import store from '../Reducers/Store.js';
import requireAuth from './Utils/RequireAuthentication.js'

const history = createBrowserHistory();

const App = () => (
  <Provider store={store}> 
   <MuiThemeProvider theme={AppTheme}>
     <Router history={history} onUpdate={() => window.scrollTo(0, 0)}>
        <Switch>
        	<Route exact path="/" component={LoginPage}/>
          <Route path="/login" component={LoginPage}/>
            <SideNavBar >
             <Route path="/register" component={requireAuth(RegistrationPage)}/>
             <Route path="/home" component={requireAuth(Home)} />
             <Route path="/uploadfile" component={requireAuth(UploadFile)} />
             <Route path="/report" component={requireAuth(Report)} />

            {/*  
              <Route path="/source" component={requireAuth(SalesForce)} />
              <Route path="/zylotech" component={requireAuth(S3)} />
              <Route path="/eloqua" component={requireAuth(Eloqua)} />*/}
            </SideNavBar>
  	   </Switch>
      </Router>
    </MuiThemeProvider>
  </Provider>
);
export default App;

