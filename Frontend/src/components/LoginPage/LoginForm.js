import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import { withRouter } from 'react-router-dom'

import LoginMessage from './LoginMessage'

// redux
import { connect } from 'react-redux';
import { login } from "../../actions/userActions";

const styles = (theme) => ({
  avatar: {
    margin: theme.spacing.unit,
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

class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      remember: false,
      errors: {},
      isLoading: false,
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.props.login(this.state, this.props)
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onChangeCheckBox = (e) => {
    const rememberState = !this.state.remember
    this.setState({ remember: rememberState });
  };

  render() {
    const { email, password, errors, isLoading } = this.state;
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
          control={
            <Checkbox color="primary" checked={this.state.remember} onChange={this.onChangeCheckBox}/>
          }
          label="Remember me"
        />
        <LoginMessage/>
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
      </form>
    )
  }
}

LoginForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({

});

const madDispatchToProps = (dispatch) => ({
  login: (userCredentials, props) => dispatch(login(userCredentials, props)),
});

LoginForm = withStyles(styles)(LoginForm);
LoginForm = withRouter(LoginForm);
LoginForm = connect(mapStateToProps, madDispatchToProps)(LoginForm);

export default LoginForm
