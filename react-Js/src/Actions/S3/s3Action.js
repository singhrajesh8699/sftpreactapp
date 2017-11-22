import properties from '../../Containers/Utils/const';
import axios from "axios";
import { error5xx,clearStateValue } from "../Helpers/helper";
var fileDownload = require('react-file-download');

export function browsers3upload(serverData){
  return (dispatch) => {
       axios.post(properties.browseruploadUrl,serverData,{
          headers: {"Authorization":localStorage.getItem('jwtToken')}
        }).then((result)=>
        {
          dispatch({type: 'browsers3upload',payload:result.data,loading:false});
        }).catch((err)=>{  
          console.log(err)
          dispatch(error5xx)
        })
  }
}

export function mapSftpServerData(serverData){
  return (dispatch) => {
    axios.post(properties.FlatFile,serverData,{
        headers: {"Authorization":localStorage.getItem('jwtToken')}
      }).then((result)=>
      {
        alert(result.data)
        //dispatch({type: 'browsers3upload',payload:result.data,loading:false});
      }).catch((err)=>{ 
        alert(err.response.data) 
        console.log(err)
        dispatch(error5xx)
      })
  }
}



