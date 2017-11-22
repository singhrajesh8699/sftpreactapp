import properties from '../../Containers/Utils/const';
import axios from "axios";
import { error5xx,clearStateValue } from "../Helpers/helper";

export const LOGIN_DATA = "LOGIN_DATA";
export const User_List = "User_List";

function loginDataDispatch(data) {
  return {
    type: LOGIN_DATA,
    payload: {data: data, fetching: false}
  }
}

export function getUserList(token){
  return (dispatch) =>{
      axios.get(properties.getUserList,
        {
          headers: {'content-type': 'application/json',
                      "Authorization":token}
        }).then((result)=>
        {
         dispatch({type: User_List,payload: result.data, fetching: false});
        }).catch((err)=>
        {  
           if(err.response.status === 502)
           {
             dispatch(error5xx)
             alert('server under maintenance')
           }else{
            alert('failure')
           }
        })
    }
}

export function validateLoginData(loginData) {
  return (dispatch) => {
    var promise= new Promise(function(resolve,reject){
    		axios.post(properties.loginUrl,JSON.stringify(loginData),
                {
                  headers:{"Content-Type":"application/json"}
                }).then((result)=>
                {
                  localStorage.setItem('jwtToken',result.data.token);
                  resolve(result.data);
                  dispatch({type: LOGIN_DATA,payload: result.data, fetching: false});
                }).catch((err)=>
                {  
                   if(err.response.status === 502)
                   {
                     dispatch(error5xx)
                     reject('502 bad request! server under maintenance')
                   }else{
                    reject('failure')
                   }
                })
	  })
    return promise;
  }
}


export function addFlashMessage(message){
    return (dispatch) =>{
      dispatch({
        type:"error",
        payload:message
      })
    }
}


export function updatePassword(newpass) {
  return (dispatch) => {
    var promise= new Promise(function(resolve,reject){
        axios.post(properties.updatePass,JSON.stringify(newpass),
                {
                  headers:{"Content-Type":"application/json"}
                }).then((result)=>
                {
                  resolve(result.data);
                  dispatch({type: LOGIN_DATA,payload: result.data, fetching: false});
                }).catch((err)=>
                {  
                   if(err.response.status === 502)
                   {
                     dispatch(error5xx)
                     reject('502 bad request! server under maintenance')
                   }else{
                    reject('failure')
                   }
                })
    })
    return promise;
  }
}

