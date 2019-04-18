import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Typography,
  withStyles,
} from '@material-ui/core';
import AlarmIcon from '@material-ui/icons/Alarm';
import BarChartIcon from '@material-ui/icons/BarChart';
import MapIcon from '@material-ui/icons/Map';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import TimelineIcon from '@material-ui/icons/Timeline';
import { connect } from 'react-redux';
import { openEditor } from '../../actions/editorActions';

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

  handleExportDataFormatClicked = (format) => {
    this.handleCloseExportDataMenu();
    console.log('export format selected:', format)
  };

  handleWidgetTypeClicked = (type) => {
    this.handleCloseCreateWidgetMenu();
    this.props.openEditor('add', { type })
  };

  handleCloseExportDataMenu = () => {
    this.setState({ exportDataMenuAnchorEl: null })
  };

  handleCloseCreateWidgetMenu = () => {
    this.setState({ createWidgetMenuAnchorEl: null })
  };

  render() {
    const { classes, dataTable } = this.props;
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
            <Menu
              anchorEl={exportDataMenuAnchorEl}
              open={Boolean(exportDataMenuAnchorEl)}
              onClose={this.handleCloseExportDataMenu}
            >
              <MenuItem onClick={() => this.handleExportDataFormatClicked('meh')}>
                <ListItemIcon>
                  <BarChartIcon />
                </ListItemIcon>
                <ListItemText primary="some form of data" />
              </MenuItem>
            </Menu>
            <Button
              disabled={!dataTable.data.length}
              variant="contained"
              color="primary"
              className={classes.actionButton}
              onClick={this.handleExportDataClicked}
            >
              <SaveAltIcon className={classes.actionButtonIcon} />
              Export Data
            </Button>

            <Menu
              anchorEl={createWidgetMenuAnchorEl}
              open={Boolean(createWidgetMenuAnchorEl)}
              onClose={this.handleCloseCreateWidgetMenu}
            >
              <MenuItem onClick={() => this.handleWidgetTypeClicked('plot')}>
                <ListItemIcon>
                  <BarChartIcon />
                </ListItemIcon>
                <ListItemText primary="Plot widget" />
              </MenuItem>
              <MenuItem onClick={() => this.handleWidgetTypeClicked('map')}>
                <ListItemIcon>
                  <MapIcon />
                </ListItemIcon>
                <ListItemText primary="Map widget" />
              </MenuItem>
              <MenuItem onClick={() => this.handleWidgetTypeClicked('forecast')}>
                <ListItemIcon>
                  <TimelineIcon />
                </ListItemIcon>
                <ListItemText primary="Forecast widget" />
              </MenuItem>
              <MenuItem onClick={() => this.handleWidgetTypeClicked('alert')}>
                <ListItemIcon>
                  <AlarmIcon />
                </ListItemIcon>
                <ListItemText primary="Alert widget" />
              </MenuItem>
            </Menu>
            <Button
              disabled={!dataTable.data.length}
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

const mapStateToProps = (state) => ({
  dataTable: state.dataTable,
});

const mapDispatchToProps = (dispatch) => ({
  openEditor: (widgetType, widgetProperties) => dispatch(openEditor(widgetType, widgetProperties)),
});

OptionsSidePanel = withStyles(styles)(OptionsSidePanel);
OptionsSidePanel = connect(mapStateToProps, mapDispatchToProps)(OptionsSidePanel);

export default OptionsSidePanel
