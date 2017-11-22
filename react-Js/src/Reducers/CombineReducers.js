import { combineReducers } from 'redux';
import Login from './Login/loginReducer';
import SalesForce from './SalesForce/salesForceReducer';
import S3 from './S3/s3Reducer';
import Home from './Home/homeReducer';
import Registration from './Registration/registrationReducer'
export default combineReducers({
   Login,
   SalesForce,
   S3,
   Home,
   Registration,
});
