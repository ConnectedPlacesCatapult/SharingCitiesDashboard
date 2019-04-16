import React from 'react';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class DeleteWidgetDialog extends React.Component {
  render() {
    return (
      <div>
        <DialogTitle id="alert-dialog-title">{"Delete this widget?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this widget?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={this.props.deleteWidget} color="secondary" variant="contained" autoFocus>
            Delete Widget
          </Button>
        </DialogActions>
      </div>
    );
  }
}

export default DeleteWidgetDialog;
