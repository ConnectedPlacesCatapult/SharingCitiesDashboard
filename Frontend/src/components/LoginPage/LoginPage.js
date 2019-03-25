import React from "react";
import PropTypes from 'prop-types';

import LoginForm from '../LoginPage/LoginForm'
import RegisterForm from '../LoginPage/RegisterForm'
import ForgotPasswordForm from '../LoginPage/ForgotPasswordForm'
import Button from '@material-ui/core/Button';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import Paper from '@material-ui/core/Paper';

import {clearLoginErrors} from "../../actions/userActions";

// redux
import { connect } from 'react-redux';

const bgImage = require('./../../images/Lisbon-logo-med.png');

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
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    //backgroundColor: theme.palette.primary.light,
  },
  appBarSpacer: theme.mixins.toolbar,
  flexWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing.unit * 3,
  },
  formTitle: {
    textTransform: 'capitalize'
  }
});

class LoginPage extends React.Component {
  state = {
    widgetModalOpen: false,
    showLogin: true,
    activeForm: 'login'
  };

  openWidgetMaker = () => {
    this.setState({ widgetModalOpen: true })
  };

  handleWidgetMakerClose = () => {
    this.setState({ widgetModalOpen: false })
  };

  setActiveForm(formName) {
    this.props.clearLoginErrors()
    this.setState({ activeForm: formName })
  }

  renderForm() {
    if (this.state.activeForm === 'login') {
      return (
        <LoginForm/>
      )
    } else if (this.state.activeForm === 'register') {
      return (
        <RegisterForm/>
      )
    } else {
      return (
      <ForgotPasswordForm/>
      )
    }
  }

  renderButtons(classes) {
    if (this.state.activeForm === 'login') {
      return (
        <div>
          <Button fullWidth variant="text" color="primary" className={classes.submit} onClick={() => this.setActiveForm('forgot-password')}>Forgot Password</Button>
          <Button fullWidth variant="text" color="primary" className={classes.submit} onClick={() => this.setActiveForm('register')}>Register</Button>
        </div>
      )
    } else if (this.state.activeForm === 'register') {
      return (
        <div>
          <Button fullWidth variant="text" color="primary" className={classes.submit} onClick={() => this.setActiveForm('login')}>Back to Login</Button>
        </div>
      )
    } else {
      return (
        <div>
          <Button fullWidth variant="text" color="primary" className={classes.submit} onClick={() => this.setActiveForm('login')}>Back to Login</Button>
        </div>
      )
    }
  }

  render() {
    const { classes, location, api } = this.props;

    return (
      <div className={classes.root}>
        <main className={classes.content}>
          <main className={classes.layout}>
            <Paper className={classes.paper}>
              <img className={classes.logoImage} src={bgImage} width="220px" height="auto" style={{marginBottom: 20}}/>
              <Typography variant="h5" className={classes.formTitle} >
                { this.state.activeForm.replace('-', ' ') }
              </Typography>
              { this.renderForm() }
              { this.renderButtons(classes) }
            </Paper>
          </main>
        </main>
      </div>
    )
  }
}

LoginPage.propTypes = {
  classes: PropTypes.object.isRequired,
  api: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  api: state.api,
});

const mapDispatchToProps = (dispatch) => ({
  clearLoginErrors: () => dispatch(clearLoginErrors()),
});

LoginPage = withStyles(styles)(LoginPage);
LoginPage = connect(mapStateToProps, mapDispatchToProps)(LoginPage);

export default LoginPage
