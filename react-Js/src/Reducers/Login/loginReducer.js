import { LOGIN_DATA ,User_List} from '../../Actions/Login/loginAction';
import { CLEAR_STATE_VALUE,ERROR_5XX} from "../../Actions/Helpers/helper";

export default function reducer(state={
    data: null,
    message:"",
    userList:[],
    fetching: true
  }, action) {

  switch(action.type) {
    case LOGIN_DATA:
      return {...state,data:action.payload,fetching:action.fetching};
    case User_List:
       return   {...state,userList:action.payload,fetching:action.fetching} ;
    case CLEAR_STATE_VALUE:
      return null;
    case ERROR_5XX:
      return null;
    case "error" :
       return {...state,message:action.payload,fetching:false}  
  }
  return state;
}