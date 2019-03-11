import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router-dom'

import LoginMessage from './LoginMessage'

// redux
import { connect } from 'react-redux';
import { requestPassword } from "../../actions/userActions";

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

class ForgotPasswordForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      errors: {},
      isLoading: false,
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.props.requestPassword(this.state.email)
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { email, errors, isLoading } = this.state;
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

ForgotPasswordForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({

});

const madDispatchToProps = (dispatch) => ({
  requestPassword: (email) => dispatch(requestPassword(email)),
});

ForgotPasswordForm = withStyles(styles)(ForgotPasswordForm);
ForgotPasswordForm = withRouter(ForgotPasswordForm);
ForgotPasswordForm = connect(mapStateToProps, madDispatchToProps)(ForgotPasswordForm);

export default ForgotPasswordForm
