import React from 'react';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class AlertDialog extends React.Component {
  render() {
    return (
      <div>
        <DialogTitle id="alert-dialog-title">{"Delete this user?"}</DialogTitle>
        <DialogContent>
          <DialogContentText color="text" id="alert-dialog-description">
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={this.props.deleteUser} color="secondary" variant="contained" autoFocus>
            Delete User
          </Button>
        </DialogActions>
      </div>
    );
  }
}

export default AlertDialog;
