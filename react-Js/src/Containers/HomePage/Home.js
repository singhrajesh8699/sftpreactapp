import React from 'react';
import {connect, ReactRedux} from 'react-redux';
import {bindActionCreators} from 'redux';
import {grey300,cyanA400} from 'material-ui/colors';
import {getSObjectList} from '../../Actions/Home/homeAction';
import {getUserList} from '../../Actions/Login/loginAction'
import Table, {
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import { RingLoader } from 'react-spinners';
import { Scrollbars } from 'react-custom-scrollbars';
import PropTypes from 'prop-types';
import FileDownload from 'material-ui-icons/FileDownload';
import Dialog, {DialogActions,DialogContent,DialogContentText,DialogTitle,} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import { LinearProgress } from 'material-ui/Progress';
import axios from "axios";
import properties from '../Utils/const'
var fileDownload = require('react-file-download');
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import Grid from 'material-ui/Grid';
import ArrowDownward from 'material-ui-icons/ArrowDownward';
import ArrowUpward from 'material-ui-icons/ArrowUpward';
import Tooltip from 'material-ui/Tooltip';

const styles = require('../AppTheme').default;

class Home extends React.Component{
  constructor(props) {
    super(props);
    this.state={loader:true,open: false,percentCompleted:0,
                timeLeft:'',startDate1: moment(),startDate2: moment(),sortDate:false,
                sortSize:false,};
  }
  
  static contextTypes = {
    router: PropTypes.object
  }


  componentDidMount(){
    if(localStorage.getItem('roles')==='admin'){
      this.props.getUserList(localStorage.getItem('jwtToken'));
    }
    this.props.getSObjectList();
  }

  componentWillReceiveProps(nextProps){
     this.setState({loader:nextProps.home.data==null})
  }

  handleDateChange1(date) {
    if(new Date(date._d).getTime()<=new Date(this.state.startDate2).getTime()){
     this.setState({ startDate1: date});
   }else{
     alert('From date should not exceed To date')
   }
  }

  handleDateChange2(date) {
   if(new Date(date._d).getTime()>=new Date(this.state.startDate1).getTime()){
     this.setState({ startDate2: date});
   }else{
     alert('From date should not exceed To date')
   }
   
  }

  handleClose(){
    this.setState({open: false});
  }

  splitFileName(folder){
    var fileNm=folder.split('/');
    for(var i in fileNm){
      if(fileNm[i].indexOf('.')>=0){
       return (<div>{fileNm[i]}</div>)
      }
    }
  }

downloadFile(folder){
  var self=this;
  self.setState({open:true,percentCompleted:0,timeLeft:''})
  var folderNm={userId:localStorage.getItem('userId'),file:folder}
  var fileNm=folderNm.file.split('/');
  let file;
  for(var i in fileNm){
    if(fileNm[i].indexOf('.')>=0){
      file=fileNm[i];
    }
  }
  axios.post(properties.downloadFileUrl,JSON.stringify(folderNm),{
      headers: {'content-type': 'application/json',
                "Authorization":localStorage.getItem('jwtToken'),}
    }).then((result)=>
    {

      function millisToMinutesAndSeconds(millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + "m :" + (seconds < 10 ? '0' : '') + seconds + 's';
      }
      var config = {
        onDownloadProgress: function(progressEvent) {
          var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
          var timeLeft=((progressEvent.timeStamp/progressEvent.loaded)*(progressEvent.total-progressEvent.loaded));
          self.setState({percentCompleted:percentCompleted,timeLeft:millisToMinutesAndSeconds(timeLeft)});
        }
      }
      axios.get(result.data.url,config)
        .then(function(response){
          fileDownload(response.data, file);
        }).catch((error)=>{
          console.log(error)
          alert('Internet Stop! Try Again')
        })
   }).catch((err)=>
    {  console.log(err)
       alert('Server error')
    })
   
}

sortDate(){
  this.setState({sortDate:true})
}

sortSize(){
  this.setState({sortSize:!this.state.sortSize})
}

  
render() {
  var self=this;
  var sortedList=[];
  if(!self.props.home.fetching){
    if(self.state.sortDate){
      var startDate=new Date(self.state.startDate1).setHours(0,0,0,0);
      var endDate=new Date(self.state.startDate2).getTime();
      var dataList=self.props.home.data.records.filter(function(data){
         return (new Date(data.LastModified).getTime()>=startDate && new Date(data.LastModified).getTime()<=endDate);
      })
      sortedList=dataList.sort(function(a,b){
        return new Date(b.LastModified)-new Date(a.LastModified);
      })

      if(self.state.sortSize){
        sortedList.sort(function(a,b){
          return b.Size-a.Size;
        })
      }

      if(localStorage.getItem('roles')==='client'){
        sortedList=sortedList.filter(function(data){
          return data.Key.split('/')[0]===localStorage.getItem('cname');
        })
      }

    }else{
      sortedList=self.props.home.data.records.sort(function(a,b){
         return new Date(b.LastModified)-new Date(a.LastModified);
      })

      if(self.state.sortSize){
       sortedList=sortedList.sort(function(a,b){
          return b.Size-a.Size;
        })
      }
      if(localStorage.getItem('roles')==='client'){
        sortedList=sortedList.filter(function(data){
          return data.Key.split('/')[0]===localStorage.getItem('cname');
        })
      }
    }
  }

return (
 <div> 
 {self.state.loader?
  <div style={{position:"relative",margin:0,left:400,top:200,width:50,height:50}}> 
    <RingLoader
        color={cyanA400} 
        loading={true} 
        margin={0}
        size={70}
      />
    <p>Loading.........</p> 
  </div> : 
   <div>
    <Paper style={styles.paper}>
      <Grid container style={{marginBottom:5}}> 
        <Grid item xs={12} sm={1} md={1} >
         <label style={{fontWeight:"600"}}>From</label>
        </Grid>
        <Grid item xs={12} sm={3} md={3} style={{position:'relative',right:'4%'}}>
          <DatePicker selected={self.state.startDate1} selectsStart
            startDate={this.state.startDate1} endDate={this.state.endDate2} 
            onChange={self.handleDateChange1.bind(self)} />
        </Grid>

        <Grid item xs={12} sm={1} md={1} style={{position:'relative',right:'11%',fontWeight:"600"}}>
          <label>To</label>
        </Grid>
        <Grid item xs={12} sm={3} md={3} style={{position:'relative',right:'17%'}}>
          <DatePicker selected={self.state.startDate2} selectsEnd
            startDate={this.state.startDate1} endDate={this.state.endDate2} 
            onChange={self.handleDateChange2.bind(self)} />
        </Grid>
        <Grid item xs={12} sm={1} md={1} style={{position:'relative',right:'26%'}}>
          <button onClick={self.sortDate.bind(self)}>Range</button>
        </Grid>
      </Grid>
    
      <Table >
        <TableHead style={styles.HTHeader}>
          <TableRow selected={true}>
            <TableCell style={styles.HTfont}>Company Name</TableCell>
            <TableCell style={styles.HTfont}>File Name</TableCell>
            <TableCell style={styles.HTfont}>Source</TableCell>
            <TableCell style={styles.HTfont}>Date</TableCell>
            <TableCell style={styles.HTfont} onClick={self.sortSize.bind(self)}>
             Size<Tooltip placement="left-end" title="sort" style={{float:'left'}}>{self.state.sortSize?<ArrowUpward />:<ArrowDownward />}</Tooltip></TableCell>
            <TableCell style={styles.HTfont}>Operation</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedList.length>0?sortedList.map(function(n,i){
            return (
                <TableRow key={i} hover>
                  <TableCell>{n.Key.split('/')[0]}</TableCell>
                  <TableCell>{self.splitFileName(n.Key)}</TableCell>
                  <TableCell>{n.Key.split('/')[2]}</TableCell>
                  <TableCell>{n.LastModified}</TableCell>
                  <TableCell>{n.Size}</TableCell>
                  <TableCell>
                  <div style={{cursor:'pointer'}} onClick={self.downloadFile.bind(self,n.Key)}>
                   <FileDownload />
                  </div></TableCell>
                </TableRow>
            )}):null}
        </TableBody>
      </Table>
    </Paper>
  </div>}

  <Dialog open={self.state.open} 
      onRequestClose={self.state.percentCompleted==100 || self.state.percentCompleted=='Infinity' ?self.handleClose.bind(self):null}>
    <DialogContent>
     <LinearProgress style={{width:'100%'}} mode="determinate" 
         value={self.state.percentCompleted}/>{self.state.percentCompleted+'%'+' '+self.state.timeLeft}
    </DialogContent>
  </Dialog>
 </div>  
    );
  }
}

function mapStatetoProps(store) {
    return {
      home: store.Home,
    }
};

function mapDispatchToProps(dispatch) {
 return bindActionCreators({getSObjectList,getUserList}, dispatch);
 
};

export default connect(mapStatetoProps, mapDispatchToProps)(Home);
