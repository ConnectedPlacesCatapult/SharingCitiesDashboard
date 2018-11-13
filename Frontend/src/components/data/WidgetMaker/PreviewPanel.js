import React from 'react';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
});

class PreviewPanel extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        PreviewPanel
      </div>
    )
  }
}

PreviewPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PreviewPanel)
