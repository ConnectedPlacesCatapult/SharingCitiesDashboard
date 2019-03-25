import React from 'react';
import PropTypes from "prop-types";

// material-ui
import { withStyles } from "@material-ui/core/styles";

//redux
import { connect } from 'react-redux';

const styles = (theme) => ({
  root: {
    display: 'flex',
  },
  widget: {
    width: '570px',
    height: '340px',
  },
});

class AlertPreview extends React.Component {
  render() {
    const { classes, alertConfig } = this.props;

    return (
      <div className={classes.root}>
        Alert Preview
      </div>
    )
  }
}

AlertPreview.propTypes = {
  classes: PropTypes.object.isRequired,
  alertConfig: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  alertConfig: state.widget.alertConfig,
});

const mapDispatchToProps = (dispatch) => ({

});

AlertPreview = withStyles(styles)(AlertPreview);
AlertPreview = connect(mapStateToProps, mapDispatchToProps)(AlertPreview);

export default AlertPreview
