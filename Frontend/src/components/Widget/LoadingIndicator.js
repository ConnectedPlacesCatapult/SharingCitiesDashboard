import React from 'react';
import PropTypes from 'prop-types';
import {
  CircularProgress,
  Typography,
  withStyles,
} from '@material-ui/core';

const styles = (theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '75%',
    padding: theme.spacing.unit * 4,
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
});

const LoadingIndicator = (props) => {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <CircularProgress color="secondary" className={classes.progress} />
      <Typography variant="subtitle1" color="primary">
        Please Wait
      </Typography>
      <Typography variant="caption" color="primary">
        fetching widget data
      </Typography>
    </div>
  );
};

LoadingIndicator.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoadingIndicator)
