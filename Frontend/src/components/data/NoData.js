import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    display: 'flex',
  },
});

class NoData extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        No data currently loaded...
      </div>
    )
  }
}

NoData.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NoData)
