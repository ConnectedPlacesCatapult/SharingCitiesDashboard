import React from "react";
import PropTypes from 'prop-types';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import BarChartIcon from '@material-ui/icons/BarChart';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MapOutlinedIcon from '@material-ui/icons/MapOutlined';

// router
import {Link, withRouter} from "react-router-dom";

const styles = (theme) => ({
  root: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: `${theme.spacing.unit * 3}px`,
    paddingBottom: `${theme.spacing.unit * 2}px`,
  },
  icon: {
    margin: theme.spacing.unit,
    fontSize: 32,
    float: "left",
  },
  link: {
    color: theme.palette.secondary.main,
    fontWeight: 600,
  }
});

class LoadingWidgets extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <div style={{textAlign: 'center'}}>
            <MapOutlinedIcon className={classes.icon} color="secondary" />
            <BarChartIcon className={classes.icon} color="secondary" />
            <NotificationsIcon className={classes.icon} color="secondary" />
          </div>
          <div style={{display: "flex"}}>
            <div style={{textAlign: 'center'}}>
              <Typography variant="h5" color="primary">
                Loading Widgets...
              </Typography>
            </div>
          </div>
        </Paper>
      </div>
    )
  }
}

LoadingWidgets.propTypes = {
  classes: PropTypes.object.isRequired,
};

LoadingWidgets = withStyles(styles)(LoadingWidgets);

export default LoadingWidgets
