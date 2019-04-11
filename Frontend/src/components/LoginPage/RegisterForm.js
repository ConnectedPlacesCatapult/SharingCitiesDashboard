import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';

import LoginMessage from './LoginMessage'

import { doRegister } from "../../actions/userActions";

// redux
import { connect } from 'react-redux';

const styles = (theme) => ({
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
    marginBottom: theme.spacing.unit * 2,
  },
});

class RegisterForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      fullName: '',
      password: '',
      passwordNew: '',
      confirmPasswordNew: '',
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
    if (this.state.passwordNew === this.state.confirmPasswordNew) {
      this.props.doRegister(this.state, this.props)
    } else {
      this.setState(
        {registrationError: 'Passwords do not match', registrationFailed: true})
    }
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { email, password, passwordNew, confirmPasswordNew, fullName, errors, isLoading } = this.state;
    const { classes } = this.props;

    return (
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
          <InputLabel htmlFor="oldPassword">Old Password</InputLabel>
          <Input
            name="password"
            type="password"
            id="oldPassword"
            autoComplete="off"
            error={errors.password}
            onChange={this.onChange}
            value={password}
          />
        </FormControl>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="passwordNew">New Password</InputLabel>
          <Input
            name="passwordNew"
            type="password"
            id="passwordNew"
            autoComplete="off"
            error={errors.passwordNew}
            onChange={this.onChange}
            value={passwordNew}
          />
        </FormControl>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="confirmPasswordNew">Confirm New Password</InputLabel>
          <Input
            name="confirmPasswordNew"
            type="password"
            id="confirmPasswordNew"
            autoComplete="off"
            error={errors.confirmPasswordNew}
            onChange={this.onChange}
            value={confirmPasswordNew}
          />
        </FormControl>
        <LoginMessage/>
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
      </form>
    )
  }
}

RegisterForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  doRegister: (userCredentials, props) => dispatch(doRegister(userCredentials, props)),
});

RegisterForm = withStyles(styles)(RegisterForm);
RegisterForm = connect(null, mapDispatchToProps)(RegisterForm);

export default RegisterForm