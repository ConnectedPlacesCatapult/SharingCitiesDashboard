import React from 'react';
import PropTypes from "prop-types";

// material-ui
import { withStyles } from "@material-ui/core/styles";

// redux
import { connect } from 'react-redux';

const styles = (theme) => ({
  root: {

  },
});

class AlertConfig extends React.Component {
  render() {
    const { classes, config, editor } = this.props;

    return (
      <form className={classes.root}>
        AlertConfig
      </form>
    )
  }
}

AlertConfig.propTypes = {
  classes: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  editor: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  config: state.config.config,
  editor: state.editor.plotConfig,
});

const mapDispatchToProps = (dispatch) => ({

});

AlertConfig = withStyles(styles)(AlertConfig);
AlertConfig = connect(mapStateToProps, mapDispatchToProps)(AlertConfig);

export default AlertConfig
