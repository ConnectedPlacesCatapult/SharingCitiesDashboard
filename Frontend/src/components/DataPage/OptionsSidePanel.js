import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper";
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import BarChartIcon from '@material-ui/icons/BarChart';

const styles = (theme) => ({
  root: {
    marginLeft: theme.spacing.unit * 2,
    width: "240px",
    position: "relative",
  },
  paper: {
    padding: theme.spacing.unit * 2,
  },
  heading: {
    //color: 'white',
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'column',
  },
  actionButton: {
    width: '175px',
    margin: `${theme.spacing.unit}px auto`,
  },
  actionButtonIcon: {
    marginRight: theme.spacing.unit,
  },
});

class OptionsSidePanel extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Typography variant="h6" className={classes.heading}>
            Filters
          </Typography>
          <Typography variant="body1" color="primary">
            Filters to set the number of records etc. can go here
          </Typography>
          <br />
          <Divider light={true} />
          <br />
          <Typography variant="h6" className={classes.heading}>
            Actions
          </Typography>
          <div className={classes.actionButtons}>
            <Button variant="contained" color="primary" className={classes.actionButton}>
              <SaveAltIcon className={classes.actionButtonIcon} />
              Export Data
            </Button>
            <Button variant="contained" color="primary" className={classes.actionButton}>
              <ShowChartIcon className={classes.actionButtonIcon} />
              Forecast Data
            </Button>
            <Button variant="contained" color="primary" className={classes.actionButton} onClick={this.props.openWidgetMaker}>
              <BarChartIcon className={classes.actionButtonIcon} />
              Create Widget
            </Button>
          </div>
        </Paper>
      </div>
    )
  }
}

OptionsSidePanel.propTypes = {
  classes: PropTypes.object.isRequired,
};

OptionsSidePanel = withStyles(styles)(OptionsSidePanel);

export default OptionsSidePanel
