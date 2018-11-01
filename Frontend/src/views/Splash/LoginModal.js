import React, { Component } from 'react';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';

const styles = theme => ({
  modal: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
});

class LoginModal extends Component {
  render() {
    const { classes, open, onClose } = this.props;

    return (
      <Modal className={classes.modal} open={open} onClose={onClose}>
        <Typography variant="title" id="modal-title">
          Text in a modal
        </Typography>
      </Modal>
    )
  }
}

LoginModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoginModal);

