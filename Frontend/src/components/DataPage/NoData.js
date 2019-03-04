import React from "react";
import PropTypes from 'prop-types';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import KeyBoardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';

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
    alignItems: 'center',
    paddingTop: `${theme.spacing.unit * 3}px`,
    paddingBottom: `${theme.spacing.unit * 2}px`,
  },
  icon: {
    margin: theme.spacing.unit,
    fontSize: 48,
    float: "left",
  },
});

class NoData extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <div style={{display: "flex"}}>
            <div style={{margin: "auto"}}>
              <KeyBoardArrowLeft className={classes.icon} color="secondary" />
            </div>
            <div style={{}}>
              <Typography variant="h4" color="primary">
                Select a Data Source
              </Typography>
              <Divider />
              <Typography variant="subtitle1" color="primary">
                Please select a data source from the sidebar to begin
              </Typography>
            </div>
          </div>
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
