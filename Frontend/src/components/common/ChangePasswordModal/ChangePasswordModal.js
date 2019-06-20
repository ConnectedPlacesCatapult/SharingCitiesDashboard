import React from 'react';
import PropTypes from 'prop-types';
import Modal from '@material-ui/core/Modal';
import Paper from "@material-ui/core/Paper";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ChangePasswordForm from "./ChangePasswordForm";
import {withStyles} from "@material-ui/core/styles/index";
import { hideChangePassword } from './../../../actions/userActions';
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

const styles = (theme) => ({
  root: {
    display: 'flex',
    clear: 'both',
  },
  content: {
    flexGrow: 1,
    //backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'auto',
  },
  layout: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  appBarSpacer: theme.mixins.toolbar,
  flexWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing.unit * 3,
  },
  formTitle: {
    textTransform: 'capitalize',
    marginTop: theme.spacing.unit * 3,
  },
  formMessage: {
    marginTop: theme.spacing.unit * 3,
    textAlign: 'center'
  }
});

class ChangePasswordModal extends React.Component {

  handleChangePasswordClose = () => {
    const { hideChangePassword } = this.props;
    hideChangePassword();
  };


  render() {
    const { classes, user } = this.props;

    return (
      <Modal open={("showChangePassword" in user) ? user.showChangePassword : false} onClose={this.handleChangePasswordClose}>
        <div className={classes.root}>
          <main className={classes.content}>
            <main className={classes.layout}>
              <Paper className={classes.paper}>
                <Typography variant="h5" className={classes.formTitle} >
                  Change Password
                </Typography>
                <Typography variant="subtitle2" color="primary" className={classes.formTitle}>Complete the form below to change your password</Typography>
                <ChangePasswordForm/>
                <Button fullWidth variant="text" color="primary" className={classes.submit} onClick={this.handleChangePasswordClose}>Cancel</Button>
              </Paper>
            </main>
          </main>
        </div>
      </Modal>
    );
  }
}

ChangePasswordModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  hideChangePassword: () => dispatch(hideChangePassword()),
});

ChangePasswordModal = withStyles(styles)(ChangePasswordModal);
ChangePasswordModal = connect(mapStateToProps, mapDispatchToProps)(ChangePasswordModal);

export default ChangePasswordModal;
