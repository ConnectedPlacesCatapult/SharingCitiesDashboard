import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";

const styles = (theme) => ({
  errorMessage: {
    textAlign: "center"
  }
});

class RegisterMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      registrationFailed: false
    };
  }

  render() {
    const { classes } = this.props;

    if (this.props.registrationFailed) {
      return (
        <div className={classes.errorMessage}>
          <Typography color="error">{this.props.registrationError}</Typography>
        </div>
      )
    } else {
      return null
    }
  }
}

RegisterMessage.propTypes = {
  classes: PropTypes.object.isRequired,
};

RegisterMessage = withStyles(styles)(RegisterMessage);

export default RegisterMessage
