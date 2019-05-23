import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import PasswordChangeMessage from './PasswordChangeMessage'

import { doPasswordChange } from "../../../actions/userActions";

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

class ChangePasswordForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: props.user.user.email,
      fullName: props.user.user.fullname,
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
      this.props.doPasswordChange(this.state, this.props)
    } else {
      console.log('here here here')
      this.setState(
      {registrationError: 'Passwords do not match', registrationFailed: true})
    }
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { password, passwordNew, confirmPasswordNew, errors, isLoading, registrationFailed, registrationError, user } = this.state;
    const { classes } = this.props;

    return (
      <form className={classes.form} onSubmit={this.onSubmit}>
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

        <PasswordChangeMessage/>

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

ChangePasswordForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  doPasswordChange: (userCredentials, props) => dispatch(doPasswordChange(userCredentials, props)),
});

ChangePasswordForm = withStyles(styles)(ChangePasswordForm);
ChangePasswordForm = connect(mapStateToProps, mapDispatchToProps)(ChangePasswordForm);

export default ChangePasswordForm