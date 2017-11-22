import properties from '../../Containers/Utils/const';
import axios from "axios";
import { error5xx,clearStateValue } from "../Helpers/helper";

export const SALESFORCE_DATA = "SALESFORCE_DATA";

function sourceDataDispatch(data) {
  return {
    type: SALESFORCE_DATA,
    payload: {data: data, fetching: false}
  }
}



export function authlogin(cloudNm,serverData){
  
  return (dispatch) => {
    var promise= new Promise(function(resolve,reject){

        axios.post(properties[cloudNm],JSON.stringify(serverData),
            {
              headers:{"Content-Type":"application/json",
                      "Authorization":localStorage.getItem('jwtToken'),}
            }
        ).then((result)=> {
            resolve(result.data);
            serverData.serverResponse=result.data;
            dispatch(sourceDataDispatch(serverData));
        }).catch((err)=>{  
             reject('failure')
             dispatch(error5xx)
            })
      })
    return promise;
  }
}


export function salesForceData(salesForceData) {
   return (dispatch) => {
    dispatch(sourceDataDispatch(salesForceData));
  }
}

export function sendSalesForceData(serverData) {
  console.log(serverData)
	return (dispatch) => {
    var promise= new Promise(function(resolve,reject){
	    	axios.post(properties.salesforce,JSON.stringify(serverData),
            {
              headers:{"Content-Type":"application/json",
                      "Authorization":localStorage.getItem('jwtToken'),}
            }
			  ).then((result)=>
            {
              resolve(result.data.url);
              serverData.serverResponse=result.data.status;
			        dispatch(sourceDataDispatch(serverData));
			 
        }).catch((err)=>
            {  
               reject('failure')
               dispatch(error5xx)
            })
      })
    return promise;
  }
}


