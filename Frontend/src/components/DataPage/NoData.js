import React from "react";
import PropTypes from 'prop-types';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';

const styles = (theme) => ({
  root: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 12,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 3}px`,
  },
  icon: {
    margin: theme.spacing.unit,
    fontSize: 48,
  },
});

class NoData extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Typography variant="h4" color="primary">
            No data loaded
          </Typography>
          <Divider />
          <Typography variant="subtitle1" color="primary">
            Please select a data source
          </Typography>
          <KeyboardArrowLeftIcon className={classes.icon} color="secondary" />
        </Paper>
      </div>
    )
  }
}

NoData.propTypes = {
  classes: PropTypes.object.isRequired,
};

NoData = withStyles(styles)(NoData);

export default NoData
