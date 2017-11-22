import properties from '../../Containers/Utils/const';
import axios from "axios";
import { error5xx,clearStateValue } from "../Helpers/helper";

export const Home_DATA = "Home_DATA";

function dashBoadDataDispatch(data) {
  return {
    type: Home_DATA,
    payload: {data: data, fetching: false}
  }
}

export function downloadFile(folderNm){
  var fileNm=folderNm.file.split('/');
  let file;
  for(var i in fileNm){
    if(fileNm[i].indexOf('.')>=0){
      file=fileNm[i];
    }
  }
  return (dispatch) => {
       axios.post(properties.downloadFileUrl,JSON.stringify(folderNm),{
            headers: {'content-type': 'application/json',
                      "Authorization":localStorage.getItem('jwtToken'),}
        }).then((result)=>
        {
          var config = {
            onDownloadProgress: function(progressEvent) {
              var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
              console.log(percentCompleted)
            }
          }
          axios.get(result.data.url,config)
                .then(function(response){
                  fileDownload(response.data, file);
                }).catch((error)=>{
                  alert('Internet Stop! Try Again')
                })
       }).catch((err)=>
            {  console.log(err)
               alert('Server error')
            })
  }
} 

export function dashBoadRecord(userId) {
  return (dispatch) => {
		axios.post(properties.dashBoadRecordUrl,JSON.stringify(userId),
            {
              headers:{
                "Content-Type":"application/json",
                "Authorization":localStorage.getItem('jwtToken'),
                }
            }).then((result)=>
            {
              dispatch(dashBoadDataDispatch({authorization:true,records:result.data.records}))
            }).catch((err)=>
            {  
              if(err.response.status === 401)
              {
               dispatch(dashBoadDataDispatch({authorization:false,records:[]})) 
              }else{
               dispatch(error5xx)
              }
            })
  }
}

export function  getSObjectList(){
 return (dispatch) => {
       axios.get(properties.sObjectUrl,{
          headers: {"Authorization":localStorage.getItem('jwtToken')}
       }).then((result)=>{
              dispatch(dashBoadDataDispatch({authorization:true,records:result.data}))
       }).catch((err)=>{  
            if(err.response.status === 401)
              {
               dispatch(dashBoadDataDispatch({authorization:false,records:[]})) 
              }else{
               dispatch(error5xx)
              }
       })
  }
}


