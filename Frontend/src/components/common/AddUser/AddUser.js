import React from 'react';
import PropTypes from 'prop-types';
import Paper from "@material-ui/core/Paper";
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import RegisterMessage from './../../LoginPage/RegisterMessage'

// material-ui
import { withStyles } from '@material-ui/core/styles';

// redux
import {connect} from "react-redux";
import { createUser } from "../../../actions/adminActions";

const styles = (theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
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
  avatar: {
    margin: theme.spacing.unit,
    //backgroundColor: theme.palette.secondary.main,
  },
  folist_usersrm: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

class AddUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      fullName: '',
      password: '',
      confirmPassword: '',
      admin: false,
      registrationFailed: false,
      registrationError: null,
      errors: {}
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onSubmit = (e) => {
    e.preventDefault();
    if (this.state.password === this.state.confirmPassword) {
      this.props.createUser(this.state)
    } else {
      this.setState(
      {registrationError: 'Passwords do not match', registrationFailed: true})
    }
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onCheckChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  render() {
    const { email, password, confirmPassword, fullName, errors, isLoading, admin } = this.state;
    const { classes } = this.props;

    return (
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h5">
            Add User
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.admin}
                  onChange={this.onCheckChange("admin")}
                  color="primary"
                />
              }
              label="Admin User"
              style={{marginTop: "10px"}}
            />
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
              onClick={this.props.closeAddUser}>
              Close
            </Button>
          </form>
        </Paper>
      </main>
    )
  }
}

AddUser.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
  createUser: (userInfo) => dispatch(createUser(userInfo)),
})

AddUser = withStyles(styles)(AddUser);
AddUser = connect(mapStateToProps, mapDispatchToProps)(AddUser);

export default AddUser
