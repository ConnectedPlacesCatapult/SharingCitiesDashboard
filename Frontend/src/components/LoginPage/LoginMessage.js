import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";

// redux
import { connect } from 'react-redux';

const styles = (theme) => ({
  errorMessage: {
    textAlign: "center"
  }
});

class LoginMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginFailed: false
    };
  }

  render() {
    const { classes } = this.props;

    if (this.props.loginFailed) {
      return (
        <div className={classes.errorMessage}>
          <Typography color="error">{this.props.loginError}</Typography>
        </div>
      )
    } else {
      return null
    }
  }
}

LoginMessage.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({

});

const madDispatchToProps = (dispatch) => ({

});

LoginMessage = withStyles(styles)(LoginMessage);
LoginMessage = connect(mapStateToProps, madDispatchToProps)(LoginMessage);

export default LoginMessage
