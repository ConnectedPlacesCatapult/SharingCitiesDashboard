import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Divider,
  Paper,
  Typography,
  withStyles,
} from '@material-ui/core';
import BarChartIcon from '@material-ui/icons/BarChart';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import ExportDataMenu from './../common/ExportDataMenu';
import CreateWidgetMenu from './../common/CreateWidgetMenu';

const styles = (theme) => ({
  root: {
    marginLeft: theme.spacing.unit * 2,
    width: "240px",
    position: "relative",
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

  state = {
    exportDataMenuAnchorEl: null,
    createWidgetMenuAnchorEl: null,
  };

  handleExportDataClicked = (e) => {
    this.setState({ exportDataMenuAnchorEl: e.currentTarget })
  };

  handleCreateWidgetClicked = (e) => {
    this.setState({ createWidgetMenuAnchorEl: e.currentTarget })
  };

  handleCloseExportDataMenu = () => {
    this.setState({ exportDataMenuAnchorEl: null })
  };

  handleCloseCreateWidgetMenu = () => {
    this.setState({ createWidgetMenuAnchorEl: null })
  };

  render() {
    const { classes } = this.props;
    const { exportDataMenuAnchorEl, createWidgetMenuAnchorEl } = this.state;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Typography variant="h6" className={classes.heading}>
            Actions
          </Typography>
          <Divider
            className={classes.divider}
            light={true}
          />
          <div className={classes.actionButtons}>
            <ExportDataMenu
              anchorEl={exportDataMenuAnchorEl}
              onClose={this.handleCloseExportDataMenu}
            />
            <Button
              variant="contained"
              color="primary"
              className={classes.actionButton}
              onClick={this.handleExportDataClicked}
            >
              <SaveAltIcon className={classes.actionButtonIcon} />
              Export Data
            </Button>
            <CreateWidgetMenu
              mode="add"
              anchorEl={createWidgetMenuAnchorEl}
              onClose={this.handleCloseCreateWidgetMenu}
              enableAlert={false}
              enableForecast={false}
            />
            <Button
              variant="contained"
              color="primary"
              className={classes.actionButton}
              onClick={this.handleCreateWidgetClicked}
            >
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
