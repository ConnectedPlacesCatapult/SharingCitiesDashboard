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

import RegisterMessage from './RegisterMessage'

import { doRegister } from "../../actions/userActions";

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

class RegisterForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      fullName: '',
      password: '',
      confirmPassword: '',
      errors: {},
      isLoading: false,
      registrationFailed: false,
      registrationError: ''
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onSubmit = (e) => {
    e.preventDefault();
    if (this.state.password === this.state.confirmPassword) {
      doRegister(this.state.email, this.state.fullName, this.state.password)
    } else {
      this.setState(
        {registrationError: 'Passwords do not match', registrationFailed: true})
    }
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  toggleForm = () => {
    this.props.onToggleForm();
  }

  render() {
    const { email, password, confirmPassword, fullName, errors, isLoading } = this.state;
    const { classes } = this.props;

    return (
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <img className={classes.logoImage} src={bgImage} width="220px" height="auto" style={{marginBottom: 20}}/>
          <Typography variant="h5">
            Register
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
              <InputLabel htmlFor="fullName">Full Name</InputLabel>
              <Input
                id="fullName"
                name="fullName"
                type="string"
                autoComplete="fullName"
                error={errors.fullName}
                onChange={this.onChange}
                value={fullName}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                name="password"
                type="password"
                id="password"
                autoComplete="off"
                error={errors.password}
                onChange={this.onChange}
                value={password}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
              <Input
                name="confirmPassword"
                type="password"
                id="confirmPassword"
                autoComplete="off"
                error={errors.confirmPassword}
                onChange={this.onChange}
                value={confirmPassword}
              />
            </FormControl>
            <RegisterMessage registrationFailed={this.state.registrationFailed} registrationError={this.state.registrationError}/>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={isLoading}
            >
              Submit
            </Button>
            <Button
              fullWidth
              variant="text"
              color="primary"
              className={classes.submit}
              onClick={this.toggleForm}>
              Back to Login
            </Button>
          </form>
        </Paper>
      </main>
    )
  }
}

RegisterForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({

});

const madDispatchToProps = (dispatch) => ({

});

RegisterForm = withStyles(styles)(RegisterForm);
RegisterForm = connect(mapStateToProps, madDispatchToProps)(RegisterForm);

export default RegisterForm
