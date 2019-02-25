import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import { withRouter } from 'react-router-dom'

import LoginMessage from './LoginMessage'

import { doLogin } from "../../actions/userActions";

// redux
import { connect } from 'react-redux';

const bgImage = require('./../../images/Lisbon-logo-med.png');

const styles = (theme) => ({
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
  avatar: {
    margin: theme.spacing.unit,
    //backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      errors: {},
      isLoading: false,
      loginFailed: false,
      loginError: ''
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onSubmit = (e) => {
    e.preventDefault();
    doLogin(this.state.email, this.state.password, this.loginFailed, this.props)
  };

  loginFailed = (e) => {
    this.setState({loginFailed: true, loginError: e.response.data.message})
    console.log('failed set')
    console.log(e.response.data.message)
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  toggleForm = () => {
    this.props.onToggleForm();
  }

  render() {
    const { email, password, errors, isLoading } = this.state;
    const { classes } = this.props;

    return (
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <img className={classes.logoImage} src={bgImage} width="220px" height="auto" style={{marginBottom: 20}}/>
          <Typography variant="h5">
            Login
          </Typography>
          <form className={classes.form} onSubmit={this.onSubmit}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email Address</InputLabel>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                autoFocus
                error={errors.email}
                onChange={this.onChange}
                value={email}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                name="password"
                type="password"
                id="password"
                autoComplete="current-password"
                error={errors.password}
                onChange={this.onChange}
                value={password}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <LoginMessage loginFailed={this.state.loginFailed} loginError={this.state.loginError}/>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={isLoading}
            >
              Sign in
            </Button>
            <Button
              fullWidth
              variant="text"
              color="primary"
              className={classes.submit}
              onClick={this.toggleForm}>
              Register
            </Button>
          </form>
        </Paper>
      </main>
    )
  }
}

LoginForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({

});

const madDispatchToProps = (dispatch) => ({

});

LoginForm = withStyles(styles)(LoginForm);
LoginForm = withRouter(LoginForm);
LoginForm = connect(mapStateToProps, madDispatchToProps)(LoginForm);

export default LoginForm
