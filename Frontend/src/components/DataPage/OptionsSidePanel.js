import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Divider,
  Paper,
  Typography,
  withStyles,
} from '@material-ui/core';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import BarChartIcon from '@material-ui/icons/BarChart';

import {
  FunctionFilter,
  TimestampFilter,
  TypeFilter
} from './../common/Filters';

const styles = (theme) => ({
  root: {
    marginLeft: theme.spacing.unit * 2,
  },
  paper: {
    padding: theme.spacing.unit * 2,
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
  divider: {
    margin: `${theme.spacing.unit}px 0`,
  },
});

class OptionsSidePanel extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <TypeFilter
            heading="Filter by value"
            subheading="Apply value specific filters to this data"
          />
          <Divider
            className={classes.divider}
            light={true}
          />
          <TimestampFilter
            heading="DateTime Range"
            subheading="Specify 'to' and 'from' timestamps"
          />
          <Divider
            className={classes.divider}
            light={true}
          />
          <FunctionFilter
            heading="Function"
            subheading="Apply aggregate functions to the data"
          />
          <Divider
            className={classes.divider}
            light={true}
          />
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

OptionsSidePanel = withStyles(styles)(OptionsSidePanel);

export default OptionsSidePanel
