import React from 'react';
import Paper from 'material-ui/Paper';
import {bindActionCreators} from 'redux';
import {connect, ReactRedux} from 'react-redux';
import {salesForceData,sendSalesForceData,authlogin} from '../../Actions/SalesForce/salesForceAction';
import { Scrollbars } from 'react-custom-scrollbars';
import TextField from 'material-ui/TextField';
import { MenuItem } from 'material-ui/Menu';
import Button from 'material-ui/Button';
import Input, { InputLabel } from 'material-ui/Input';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import styles from '../AppTheme';
import Divider from 'material-ui/Divider';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Grid from 'material-ui/Grid';
import DropboxChooser from 'react-dropbox-chooser';


class Clouds extends React.Component{

  constructor(props) {
    super(props);
    this.state = {CId:'',CSk:''};
  }
  componentDidMount(){
  	
  } 
  componentWillReceiveProps(nextProps){
   
  }

  handleOnClick(){
    var CId =document.getElementById('CId').value;
    var CSk=document.getElementById('CSk').value;
    this.setState({CId:CId,CSk:CSk}); 
  } 

  handleOnSubmit(cloudNm){
    var userId=localStorage.getItem('userId');
    var cname=localStorage.getItem('cname');
    var userName=localStorage.getItem('username');
    var CId=this.state.CId;
    var CSk=this.state.CSk;
    var serverdata={userId:userId,userName:userName,cname:cname,CId:CId,CSk:CSk};
        this.props.authlogin(cloudNm,serverdata).then(function(resolve){
          var win=window.open(resolve.url,'_blank',
             'toolbar=yes,scrollbars=yes,resizable=yes,top=300,left=500,width=600,height=500');
        })
        .catch(function(error){
            console.log(error)
        });
  }

  
  onSuccess(files,self){
    var userId=localStorage.getItem('userId');
    var cname=localStorage.getItem('cname');
    var userName=localStorage.getItem('username');
    var CId=this.state.CId;
    var CSk=this.state.CSk;
    var serverdata={userId:userId,userName:userName,cname:cname,files:files};
        this.props.authlogin('DropBox',serverdata).then(function(resolve){
          alert(resolve)
          /*var win=window.open(resolve,'_blank',
             'toolbar=yes,scrollbars=yes,resizable=yes,top=300,left=500,width=600,height=500');*/
        })
        .catch(function(error){
            console.log(error)
        });
  }

  onCancel(){
    
  }

	render(){
		var self=this;
  return(
    <div>
    <Grid container style={{marginBottom:10}}> 
     <Grid item xs={12} sm={3} md={3} >
      <Card >
        <CardMedia style={{position:'relative',left:'18%'}}>
         <div style={{paddingTop:'10px',display: 'flex'}}>
          <img src="assets/images/Salesforce.svg" width="71%" height="70%"/>
        </div>
        </CardMedia>
         <CardActions style={{position:'relative',left:'20%'}}>
          <Button raised color="primary" onClick={self.handleOnSubmit.bind(self,'SalesForce')}>
            SalesForce
          </Button>
         </CardActions>
        </Card>
      </Grid>
      <Grid item xs={12} sm={3} md={3} >
      <Card >
        <CardMedia style={{position:'relative',left:'15%'}}>
         <div style={{paddingTop:'55px',display: 'flex'}}>
          <img src="assets/images/eloqua.png" width="70%" height="70%"/>
        </div>
        </CardMedia>
         <CardActions style={{position:'relative',left:'20%',paddingTop:'20px'}}>
          <Button raised color="primary" onClick={self.handleOnSubmit.bind(self,'Eloqua')}>
            Eloqua
          </Button>
         </CardActions>
        </Card>
      </Grid>

      <Grid item xs={12} sm={3} md={3} >
      <Card >
        <CardMedia style={{position:'relative',left:'16%'}}>
         <div style={{paddingTop:'10px',display: 'flex'}}>
          <img src="assets/images/googledrive.png" width="70%" height="69%"/>
        </div>
        </CardMedia>
        <CardActions style={{position:'relative',left:'20%'}}>
          <Button raised color="primary" onClick={self.handleOnSubmit.bind(self,'GoogleDrive')}>
            Google Drive
          </Button>
        </CardActions>
      </Card>
    </Grid>
    </Grid>

   <Grid container style={{marginBottom:5}}> 
    <Grid item xs={12} sm={3} md={3} >
      <Card>
        <CardMedia style={{position:'relative',left:'20%'}}>
         <div style={{paddingTop:'10px',display: 'flex'}}>
          <img src="assets/images/dropbox.png" width="54%" height="60%" />
         </div> 
        </CardMedia>
        <CardActions style={{position:'relative',left:'20%'}}>
          <DropboxChooser 
              appKey={'jmawfifbdf3y79v'}
              success={files => self.onSuccess(files,self)}
              cancel={() => self.onCancel()}
              multiselect={true}>
              <Button raised color="primary">
                DropBox
              </Button>
          </DropboxChooser>
        </CardActions>
      </Card>
    </Grid>
  
    <Grid item xs={12} sm={3} md={3} >  
      <Card>
        <CardMedia style={{position:'relative',left:'20%'}}>
        <div style={{paddingTop:'10px',display: 'flex'}}>
          <img src="assets/images/onedrive.png" width="50%" height="50%"/>
        </div>
        </CardMedia>
        <CardActions style={{position:'relative',left:'20%'}}>
          <Button raised color="primary" onClick={self.handleOnSubmit.bind(self,'OneDrive')}>
            OneDrive
          </Button>
        </CardActions>
      </Card>
    </Grid>
  </Grid> 
    </div>
  	  )
	}
}

function mapStatetoProps(store) {
    return {
      salesforce: store.SalesForce
    }
};

function mapDispatchToProps(dispatch) {
 return bindActionCreators({salesForceData,sendSalesForceData,authlogin}, dispatch);
 
}

export default connect(mapStatetoProps, mapDispatchToProps)(Clouds);