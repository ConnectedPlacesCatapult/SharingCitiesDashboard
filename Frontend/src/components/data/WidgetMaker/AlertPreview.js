import React from 'react';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { connect } from 'react-redux';

const styles = theme => ({
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
    const {classes, config, editor} = this.props;

    return (
      <div className={classes.root}>
        Alert Preview
      </div>
    )
  }
}

AlertPreview.propTypes = {
  classes: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  editor: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  config: state.config.config,
  editor: state.editor,
});

const mapDispatchToProps = dispatch => ({

});

AlertPreview = withStyles(styles)(AlertPreview);

export default connect(mapStateToProps, mapDispatchToProps)(AlertPreview)
