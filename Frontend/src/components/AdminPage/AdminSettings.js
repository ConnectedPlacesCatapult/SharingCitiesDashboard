import React from "react";
import PropTypes from 'prop-types';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const styles = (theme) => ({
  root: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 3,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    padding: `${theme.spacing.unit * 3}px`,
  },
  icon: {
    margin: theme.spacing.unit,
    fontSize: 48,
    float: "left",
  },
});

class AdminSettings extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <div style={{display: "flex"}}>
            <div style={{}}>
              <Typography variant="h4" color="primary">
                Admin Settings
              </Typography>
              <Divider />
              <Typography variant="subtitle1" color="primary">
                {/*Please select a data source from the sidebar to begin*/}
              </Typography>
            </div>
          </div>
        </Paper>
      </div>
    )
  }
}

AdminSettings.propTypes = {
  classes: PropTypes.object.isRequired,
};

AdminSettings = withStyles(styles)(AdminSettings);

export default AdminSettings
