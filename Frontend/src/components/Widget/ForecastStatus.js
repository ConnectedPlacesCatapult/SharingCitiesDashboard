import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
  withStyles,
} from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import TimeIcon from '@material-ui/icons/AccessTime';

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
  pendingIcon: {
    margin: theme.spacing.unit * 2,
    color: theme.palette.secondary.main,
    fontSize: 46
  }
});

const ForecastStatus = (props) => {
  const { classes, loadState, loadStatus } = props;

  return (
    <div className={classes.root}>
      {loadState === "ERROR" ? (
        <ErrorIcon className={classes.pendingIcon} />
      ) : (
        <TimeIcon className={classes.pendingIcon} />
      )}
      <Typography variant="subtitle1" color="primary">
        Status: {loadState}
      </Typography>
      <Typography variant="caption" color="primary">
        {loadStatus}
      </Typography>
    </div>
  );
};

ForecastStatus.propTypes = {
  classes: PropTypes.object.isRequired,
  loadState: PropTypes.string.isRequired,
  loadStatus: PropTypes.string.isRequired,
};

export default withStyles(styles)(ForecastStatus)
