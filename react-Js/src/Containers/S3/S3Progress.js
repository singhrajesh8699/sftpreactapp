import React from 'react';
import Paper from 'material-ui/Paper';
import styles from '../AppTheme';
import Divider from 'material-ui/Divider';
import Dialog, {DialogActions,DialogContent,DialogContentText,DialogTitle,} from 'material-ui/Dialog';
import { LinearProgress } from 'material-ui/Progress';
import Grid from 'material-ui/Grid';

class S3Progress extends React.Component{

  constructor(props) {
    super(props);
    this.state = {open:false};
  }
  componentDidMount(){
  	
  }
  componentWillReceiveProps(nextProps){
     this.setState({open:nextProps.open})
  } 
  handleClose(){
    this.setState({open: false});
  }


  render(){
		var self=this;
    return(
       <Dialog open={self.state.open} onRequestClose={self.handleClose.bind(self)} style={{width:'100%',height:'100%'}}>
        <DialogContent >
        {self.props.state.percent.map(function(percent,k){
          console.log(percent)
          return(
            <div style={{marginTop:15}}>
               {self.props.state.file[k].name}
               <LinearProgress style={{width:'100%'}} mode="determinate" value={percent}/>
               {percent+'%'+'  '}{percent==100?'done':self.props.state.timeLeft[k]}
            </div>
          )
         })
        }
        </DialogContent>
      </Dialog>
    )
	}
}

export default S3Progress;