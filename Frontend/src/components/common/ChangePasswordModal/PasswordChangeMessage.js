import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";

// redux
import { connect } from 'react-redux';

const styles = (theme) => ({
  message: {
    textAlign: "center"
  }
});

class PasswordChangeMessage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes, user } = this.props;

    if (user.loginMessage) {
      return (
        <div className={classes.message}>
          <Typography color="primary">{user.loginMessage}</Typography>
        </div>
      )
    } else if (user.loginError) {
      return (
        <div className={classes.message}>
          <Typography color="error">{user.loginError}</Typography>
        </div>
      )
    } else {
      return null
    }
  }
}

PasswordChangeMessage.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

PasswordChangeMessage = withStyles(styles)(PasswordChangeMessage);
PasswordChangeMessage = connect(mapStateToProps, null)(PasswordChangeMessage);

export default PasswordChangeMessage