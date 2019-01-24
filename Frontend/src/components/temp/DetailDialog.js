import React from 'react';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

const styles = theme => ({

});

class DetailDialog extends React.Component {
  render() {
    const { classes, ...other } = this.props;

    return (
      <Dialog onClose={this.props.onClose} {...other}>
        <DialogTitle id="simple-dialog-title">Details</DialogTitle>
      </Dialog>
    )
  }
}

DetailDialog = withStyles(styles)(DetailDialog);

export default DetailDialog
