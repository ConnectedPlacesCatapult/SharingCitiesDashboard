import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';

const styles = theme => ({
  close: {
    padding: theme.spacing.unit / 2,
  },
  successNotification: {
    backgroundColor: '#4CAF50',
    color: 'white',
    fontWeight: 600
  },
  failureNotification: {
    backgroundColor: '#ff5722',
    color: 'white',
    fontWeight: 600
  },
});

class SimpleSnackbar extends React.Component {
  state = {
    open: false,
  };

  handleClick = () => {   
    this.setState({ open: true });
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ open: false });
  };

  renderIcon() {
    if (this.props.notification.variant === 'successNotification') {
      return <CheckCircleIcon/>
    } else {
      return <ErrorIcon/>
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Snackbar
          variant="primary"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.props.notification.showAlert}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}>
          <SnackbarContent message={<span id="message-id">{this.props.notification.message}<br/>{this.props.notification.error}</span>}
                           className={classes[this.props.notification.variant]} action={this.renderIcon()}/>
        </Snackbar>

      </div>
    );
  }
}

SimpleSnackbar.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(SimpleSnackbar)
