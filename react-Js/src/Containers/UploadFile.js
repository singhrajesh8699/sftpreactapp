import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import Clear from 'material-ui-icons/Clear';
import ModeEditIcon from 'material-ui-icons/ModeEdit';
import Cloud from 'material-ui-icons/Cloud';
import FileUpload from 'material-ui-icons/FileUpload';
import SalesForce from './SalesForce/SalesForce';
import FlatFile from './S3/S3';
import Clouds from './Clouds/Clouds';
import Eloqua from './Eloqua/Eloqua';
import Tooltip from 'material-ui/Tooltip';

const styles = theme => ({
  button: {
    margin:'6px',
    width:'40px',
    height:'40px',
  },
  buttonPos:{
    position: 'fixed',
    bottom: 0,
    right: 22,
    marginBottom:10,
    width:'45px',
    height:'45px',
  },
  subbuttonPos:{
    position: 'fixed',
    bottom: 65,
    right: 21,
    display: 'flex',
   'flexDirection': 'column',
  },
  source:'SalesForce',
});

class UploadFile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 0,show:false,flatfile:true,salesforce:false,eloqua:false,clouds:false,
    };
  }

  mouseOut() {
    this.setState({show: false});
  }
  
  mouseOver() {
    this.setState({show:!this.state.show});
  }

  sourceType(source){
    if(source=='flatfile'){
      this.setState({flatfile:true,salesforce:false,eloqua:false,clouds:false})
    }else if(source=='salesforce'){
      this.setState({flatfile:false,salesforce:true,eloqua:false,clouds:false})
    }else if(source=='eloqua'){
      this.setState({flatfile:false,salesforce:false,eloqua:true,clouds:false})
    }else{
      this.setState({flatfile:false,salesforce:false,eloqua:false,clouds:true})
    }
  }
  

  render() {
     var self=this;
     const { classes } = this.props;
     
    return (
      
        <div>
         <div>
         { self.state.flatfile?<FlatFile />
          :self.state.salesforce? <SalesForce /> 
          :self.state.eloqua?<Eloqua />
          :self.state.clouds?<Clouds />:null }
         </div>

         {self.state.show?
          <div className={classes.subbuttonPos}>
          <Tooltip placement="left" title="Clouds">
            <Button fab color="primary" aria-label="cloud" className={classes.button}
             onClick={self.sourceType.bind(self,'clouds')}>
               <Cloud />
            </Button>
          </Tooltip>

           <Tooltip placement="left" title="FileUpload">  
            <Button fab color="primary" aria-label="cloud" className={classes.button}
             onClick={self.sourceType.bind(self,'flatfile')}>
               <FileUpload />
            </Button>
          </Tooltip>

          </div>:null}

          <Tooltip placement="left" title="Options">
           <Button fab color="primary" aria-label="add" className={classes.button,classes.buttonPos} 
            onClick={self.mouseOver.bind(self)}>
           {self.state.show?<Clear /> :
            <AddIcon />}
           </Button>
          </Tooltip> 
        </div>
    );
  }
}


export default withStyles(styles)(UploadFile);
