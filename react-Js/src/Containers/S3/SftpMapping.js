import React from 'react';
import axios from "axios";
import Paper from 'material-ui/Paper';
import {connect, ReactRedux} from 'react-redux';
import {bindActionCreators} from 'redux';
import {mapSftpServerData} from '../../Actions/S3/s3Action';
import { ScaleLoader } from 'react-spinners';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import Input, { InputLabel } from 'material-ui/Input';
import Table, {TableBody,TableCell,TableFooter,TableHead,TablePagination,TableRow,TableSortLabel} from 'material-ui/Table';
import { Scrollbars } from 'react-custom-scrollbars';
import Grid from 'material-ui/Grid';

var _ = require('lodash');

const styles = require('../AppTheme').default;

class SftpMapping extends React.Component{

  constructor(props) {
    super(props);
    this.state ={
      file:null,
      editable:false,
      rawData:[],
      rawHeaderList:[],
      modHeaderList:[],
      dataTypeList:[],
      dateFormate:[],
      showDateField:false,
      key:'',
    }   
 } 

  splitData(data){
    var arrData=data.split('\n');
    var rawHeaderList=[];
    var modHeaderList=[];
    var dataTypeList=[];
    var dateFormate=[];
    var rawData=[];
   if(arrData.length>0){
    for(var i in arrData){
        if(i==6){
            break;
        }else if(i==0){
          rawHeaderList=arrData[0].split(',');
          for(var j in rawHeaderList){
            if(rawHeaderList[j]==''){
              modHeaderList.push('h'+j); 
            }else{
              modHeaderList.push(this.removeSpeacialChar(rawHeaderList[j]));
            }
            dataTypeList.push('String');
            dateFormate.push('dd/mm/yyyy');
           }
        }else{
            var arr=arrData[i].split(',')
            rawData.push(arr);
      }
    } 
  }   
      
  this.setState({rawHeaderList:rawHeaderList,modHeaderList:modHeaderList,
                 dataTypeList:dataTypeList,dateFormate:dateFormate,rawData:rawData});
}

componentWillReceiveProps(nextProps){
   var self=this;
   if(nextProps.fileObj){
    var file = nextProps.fileObj;
    var reader = new FileReader();
    var start = 0;
    var stop = 1024*1024;

   reader.onloadend = function(e) {
      if (e.target.readyState == FileReader.DONE) {
        var data = e.target.result;
        var byteLength = data.byteLength;
        let data = e.target.result;
        self.splitData(data);
      }
    }
    var blob = file.slice(start, stop);
    reader.readAsText(blob);
  }
} 

removeSpeacialChar(header){
  var data=header.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
    return data.replace(/ /g,"_").toLowerCase();
}

editable(value){
  this.setState({editable:value})
}

modifyHeader(key){
   var data= document.getElementById('h'+key).value;
   var modifyHeader=this.state.modHeaderList;
       modifyHeader[key]=data;
    this.setState({modHeaderList:modifyHeader});
}

changeDataType(key){
   var data= document.getElementById('dt'+key).value;
   var dataTypeList=this.state.dataTypeList;
       dataTypeList[key]=data;
    if(data=='Date'){
      this.setState({showDateField:true,key:key})
    }
    this.setState({dataTypeList:dataTypeList});
}

dateFormate(key){
    var data= document.getElementById('df'+key).value;
    var dateFormate=this.state.dateFormate;
    dateFormate[key]=data;
    this.setState({dateFormate:dateFormate});
}

mapSftpData(){
 if(this.props.state.fileObj!='') { 
  var rawHeaderList=this.state.rawHeaderList;
  var modHeaderList=this.state.modHeaderList;
  var dataTypeList=this.state.dataTypeList;
  var dateFormate=this.state.dateFormate;
  var main_map={};
  var reverse_map={};
  var dataType_map={};
  for(var i in rawHeaderList){
    main_map[rawHeaderList[i]]=modHeaderList[i];
    reverse_map[modHeaderList[i]]=rawHeaderList[i];
    if(dataTypeList[i]=='Date'){
      dataType_map[modHeaderList[i]]={'type':dataTypeList[i],'format':dateFormate[i]}
    }else{
       dataType_map[modHeaderList[i]]={'type':dataTypeList[i]}
    }
  }
  var config={
    userId:localStorage.getItem('userId'),
    main_map:main_map,
    reverse_map:reverse_map,
    dataType_map:dataType_map,
    filename:this.props.state.selectedFile,
  }
  this.props.mapSftpServerData(config);
 }else{
  alert('first choose file');
 }
}

selectMethod(){
  return(
    <Grid container>  
    <Grid item xs={8} sm={4} md={4}>
      <h3>select file for mapping</h3>
    </Grid>
    <Grid item xs={4} sm={2} md={2} style={{position:'relative',marginTop:'15px',right:'10px'}}>
      <select value={this.props.state.selectedFile} onChange={this.props.selectFile}>
       { this.props.state.fileArr.map(function(obj){
          return <option value={obj.name} >{obj.name}</option>
        })}
      </select>
    </Grid>
    </Grid>  
    )
}

render(){
  var self=this;
  var file=self.props.state.file;

  return(
    <div>
      <Grid container>  
       <Grid item xs={3} sm={2} md={3} >
          <h3>Sftp Mapping</h3>
       </Grid>
       <Grid item xs={3} sm={7} md={7}>
         {self.props.state.filemapping?self.selectMethod():null}
       </Grid>
       <Grid item xs={4} sm={3} md={2} style={{position:'relative',top:'7px'}}>
        <Button raised color="primary" onClick={self.mapSftpData.bind(self)}>submit</Button>
       </Grid>
      </Grid>
     <Divider />
     <div>  
       <Table style={{overflow:'auto', padding:'20px'}}>
        <TableHead style={styles.HTHeader}>
          <TableRow selected={true} onClick={self.editable.bind(self,false)}>
            {self.state.rawHeaderList.map(function(header,key){
                return(<TableCell style={styles.HTfont} >
                        {header==''?'H'+key:header}
                      </TableCell>);
             })}
          </TableRow>
        </TableHead>
        <TableBody>
         <TableRow selected={true} onClick={self.editable.bind(self,true)}>
            {self.state.modHeaderList.map(function(header,key){
              return(
                <TableCell style={{fontSize:'small'}}>
                  {!self.state.editable?header
                    :<input type='text' id={'h'+key} value={header} 
                    onChange={self.modifyHeader.bind(self,key)} style={{width:'120px'}}/>}
                </TableCell>
                );
             })}
          </TableRow>

          <TableRow selected={true}>
            {self.state.dataTypeList.map(function(datatype,key){
              return(
                <TableCell style={styles.HTfont}>
                 <select id={'dt'+key} value={datatype} style={{width:'120px'}} 
                   onChange={self.changeDataType.bind(self,key)}>
                   <option value='Integer'>Integer</option>
                   <option value='Float'>Float</option>
                   <option value='String'>String</option>
                   <option value='Boolean'>Boolean</option>
                   <option value='Date'>Date</option>
                 </select>
           {self.state.showDateField && self.state.key==key?
              <input type='text' placeholder="dd/mm/yyyy" value={self.state.dateFormate[key]}
              style={{width:'120px'}} id={'df'+key} onChange={self.dateFormate.bind(self,key)}/>:null}
                </TableCell>
                );
             })}
          </TableRow>
         
          {self.state.rawData.map(function(datalist,key){
            return(<TableRow selected={true} > 
                {datalist.map(function(data,key){
                  return(<TableCell style={{fontSize:'small'}} >
                            {data}
                         </TableCell>
                        );
                  })}
                  </TableRow>
                  )
          })}
        </TableBody>
      </Table>
    </div>
  </div>    
    )
  }
}

function mapStatetoProps(store) {
    return {
      s3: store.S3,
    }
};

function mapDispatchToProps(dispatch) {
 return bindActionCreators({mapSftpServerData}, dispatch);
}

export default connect(mapStatetoProps, mapDispatchToProps)(SftpMapping);