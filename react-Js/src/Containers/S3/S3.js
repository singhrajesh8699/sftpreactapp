import React from 'react';
import axios from "axios";
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import {connect, ReactRedux} from 'react-redux';
import {bindActionCreators} from 'redux';
import {browsers3upload} from '../../Actions/S3/s3Action';
import {getUserList} from '../../Actions/Login/loginAction'
import { ScaleLoader } from 'react-spinners';
import Button from 'material-ui/Button';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import { LinearProgress } from 'material-ui/Progress';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import Input, { InputLabel } from 'material-ui/Input';
import SftpMapping from './SftpMapping';
import Tooltip from 'material-ui/Tooltip';
import S3Progress from './S3Progress'

var _ = require('lodash');

const styles = require('../AppTheme').default;

class S3 extends React.Component{

  constructor(props) {
    super(props);
    this.state ={
      file:[],
      fileObj:'',
      fileArr:[],
      buttonLabel:'Choose File',
      fetching:false,
      status:'',
      fileList:'',
      percent: [],
      timeLeft:[],
      progressbar:false,
      status:'',
      disabled:false,
      totalfile:0,
      selectedFile:'Choose file',
      filemapping:false,
  }
   
 } 

 componentDidMount(){
    if(localStorage.getItem('roles')==='admin'){
      this.props.getUserList(localStorage.getItem('jwtToken'));
    }
  }


handleFileUpload(e) {
  if(e.target.files.length<=8){
      var buttonLabel='';
      var files=[]
      var fileType=[];
      var size=[];
      var fileArr=[];
     for(var i in e.target.files){
       if(e.target.files[i].name!=undefined && e.target.files[i].name!='item'){
          buttonLabel=buttonLabel+e.target.files[i].name+',';
          files[i]=e.target.files[i].name;
          fileType[i]=e.target.files[i].type;
          size[i]=e.target.files[i].size;
          fileArr.push(e.target.files[i]);
       }
     }
    this.setState({file:e.target.files,buttonLabel:buttonLabel,totalfile:files.length,
      percent:[],timeLeft:[],disabled:false,progressbar:false,status:'',fileObj:e.target.files[0],
      fileArr:fileArr,filemapping:true,selectedFile:e.target.files[0].name});
    var d=new Date();
    var yy=d.getUTCFullYear();
    var mm=(d.getUTCMonth()+1)<=9?'0'+d.getUTCMonth()+1:d.getUTCMonth()+1;
    var dd=(d.getUTCDate()<=9)?'0'+d.getUTCDate():d.getUTCDate();
    var hh =(d.getUTCHours()<=9)?'0'+d.getUTCHours():d.getUTCHours();
    var mn=(d.getUTCMinutes()<=9)?'0'+d.getUTCMinutes():d.getUTCMinutes();
    var ss=(d.getUTCSeconds()<=9)?'0'+d.getUTCSeconds():d.getUTCSeconds();
    var tim=hh+'_'+mn+'_'+ss;
    var currDat = d.toUTCString();
    var path='';
    if(localStorage.getItem('roles')=='admin' && localStorage.getItem('switchuser')!=undefined){
      var switchuser=JSON.parse(localStorage.getItem('switchuser'));
      path=switchuser.cname+'/input/flatfile/'+yy+'/'+mm+'/'+dd+'/'+tim+'_';
    }else{
      path=localStorage.getItem('cname')+'/input/flatfile/'+yy+'/'+mm+'/'+dd+'/'+tim+'_';
    }
    var serverData={clientId:localStorage.getItem('userId'),
                    path:path,
                    files:files,
                    filetype:fileType,
                    size:size,
                    currDat:currDat}
    this.props.browsers3upload(serverData);
  }else{
    this.setState({disabled:true})
    alert('You can upload only 4 file at a time!')
  }
}
  

  handleOnSubmit(){
   if(this.state.file.length>0){
    var self=this;
    self.setState({progressbar:true});
    var signedUrl = self.props.s3.browsers3upload.url;

    function millisToMinutesAndSeconds(millis) {
      var minutes = Math.floor(millis / 60000);
      var seconds = ((millis % 60000) / 1000).toFixed(0);
      return minutes + "m :" + (seconds < 10 ? '0' : '') + seconds + 's';
    }

    function config(i){
      return({
         onUploadProgress: function(progressEvent) {
          var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
          var timeLeft=((progressEvent.timeStamp/progressEvent.loaded)*(progressEvent.total-progressEvent.loaded));
          var newPercent = deepcopy(self.state.percent), newTimeLeft = deepcopy(self.state.timeLeft);
          newPercent[i] = percentCompleted;
          newTimeLeft[i] = millisToMinutesAndSeconds(timeLeft);
          self.setState({percent: newPercent,timeLeft:newTimeLeft})
         }
      })
    } 

    function options(i){
      return({
         headers: {'x-amz-acl':'public-read',}
        })
    }

   
   signedUrl.map(function(url,i){
     return(
       axios.put(url,self.state.file[i],config(i),options(i))
        .then((result)=>{
          self.setState({progressbar:true,status:'success'})
      }).catch((err)=>{
          self.setState({progressbar:true,status:'error'})
          console.log(err)
      })
      )
   })
  }else{
    alert('first choose files')
  } 
}

selectFile(e){
  var file=this.state.file;
  for(var i in file){
    if(file[i].name==e.target.value)
      this.setState({selectedFile:e.target.value,fileObj:file[i]})
  }
}


render(){
    var self=this;
    var fileList=[];
    if(!this.props.s3.fetching){
       fileList =this.props.s3.sobjtList.sort(function(a,b){
           return new Date(b.LastModified)-new Date(a.LastModified);
        })
      }
      
    
return(
 <div style={styles.s3root}>
  <Grid container spacing={10}>
   <Paper elevation={4} style={styles.s3margin1}>
    <Grid container>  
       <Grid item xs={12} sm={12} md={12} >
          <h3>Upload File To ZyloTech Platform</h3>
       </Grid>
    </Grid>
    <Divider />
    <Grid container style={{marginTop:10}}>  
      <Grid item xs={2} sm={2} md={2}>
          <label style={{position: 'relative',left: '33px',top: '8px'}}>Choose File</label>
      </Grid>
      <Grid item xs={2} sm={2} md={2}>
        <Button raised color="primary">
             <label>{self.state.buttonLabel.length > 13?
                     self.state.buttonLabel.substring(0,12)+'..':self.state.buttonLabel}</label>
          <input type="file" onChange={self.handleFileUpload.bind(self)} 
                 style={styles.innerFileInput} multiple={4}/>
        </Button>
      </Grid> 
      <Grid item xs={3} sm={2} md={2}>
         <Button raised color="primary" onClick={self.handleOnSubmit.bind(self)} 
           disabled={self.state.disabled}>Upload</Button>
      </Grid>
   {self.state.status=='success'?
      <Grid item xs={3} sm={4} md={2}>
         <label style={{position:'relative',top:'8px',right:'40px'}}>Uploaded Successfully</label> 
      </Grid> : self.state.status=='error' ? 
      <Grid item xs={3} sm={4} md={2}>
        <label style={{position:'relative',top:'8px',right:'40px',width:'150px'}}>File Uploading Failed</label> 
      </Grid> : null} 
    </Grid>
   
  {self.state.progressbar?
    self.state.percent.length==0?<p style={{position:'relative',left:'33px',margin:0,padding:0}}>loading...</p>:
      <S3Progress open={self.state.progressbar} state={self.state}/>
    : null
  }
    
   </Paper>
   </Grid> 

   <Grid container spacing={10} style={{marginTop:10}}>
    <Paper elevation={4} style={styles.s3margin2}>
      <Grid container>  
        <Grid item xs={12} sm={12} md={12} >
          <SftpMapping fileObj={self.state.fileObj}  state={self.state} 
               selectFile={self.selectFile.bind(self)}/>
        </Grid>
      </Grid>
    </Paper>
   </Grid>
</div>  
    )
  }
}

function deepcopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function mapStatetoProps(store) {
    return {
      s3: store.S3,
    }
};

function mapDispatchToProps(dispatch) {
 return bindActionCreators({browsers3upload,getUserList}, dispatch);
}

export default connect(mapStatetoProps, mapDispatchToProps)(S3);