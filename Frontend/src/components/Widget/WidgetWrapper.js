import React from 'react';
import PropTypes from 'prop-types';
import {
  IconButton,
  Paper,
  Popover,
  Tooltip,
  Typography,
  withStyles,
} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import InfoIcon from '@material-ui/icons/Info';
import OpenWithIcon from '@material-ui/icons/OpenWith';
import MapIcon from '@material-ui/icons/Map';
import DeleteIcon from '@material-ui/icons/Delete';
import BarChartIcon from '@material-ui/icons/BarChart';
import TimelineIcon from '@material-ui/icons/Timeline';
import AlarmIcon from '@material-ui/icons/Alarm';
import { connect } from 'react-redux';
import { openEditor } from '../../actions/editorActions';
import { openDeleteWidget } from '../../actions/dashboardActions';

const styles = (theme) => ({
  widget: {
    borderRadius: '3px',
    padding: theme.spacing.unit,
    height: '100%',
  },
  widgetHeader: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    color: theme.palette.text.primary,
  },
  widgetHeaderIcon: {
    margin: `0 ${theme.spacing.unit}px`,
  },
  widgetHeaderSpacer: {
    flexGrow: 2,
  },
  widgetBodyWrapper: {
    height: 'inherit',
  },
  widgetBodyContent: {
    height: '100%',
    width: 'auto',
  },
  smallerButton: {
    padding: theme.spacing.unit,
    transform: 'scale(0.8)',
  },
  popoverText: {
    margin: theme.spacing.unit * 2,
  },
});

class WidgetWrapper extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    i: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    isStatic: PropTypes.bool.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    config: PropTypes.object.isRequired,
    queryParams: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    openDeleteWidget: PropTypes.func.isRequired,
  };

  state = {
    popoverAnchorEl: null,
  };

  handleShowInfoClick = (e) => {
    this.setState({
      popoverAnchorEl: e.currentTarget,
    });
  };

  handlePopoverClose = () => {
    this.setState({
      popoverAnchorEl: null,
    });
  };

  handleEditWidgetClick = () => {
    const { i, type, name, description, isStatic, width, height, config, queryParams, openEditor } = this.props;
    openEditor('edit', { i, type, name, description, isStatic, width, height, config, queryParams })
  };

  handleDeleteWidgetClick = () => {
    const { i, openDeleteWidget } = this.props;
    openDeleteWidget(i)
  };

  render() {
    const { classes, type, name, description, isStatic, children } = this.props;
    const { popoverAnchorEl } = this.state;

    return (
      <Paper className={classes.widget}>
        <div className={classes.widgetHeader}>
          {type === 'plot' && <BarChartIcon className={classes.widgetHeaderIcon} fontSize="small" />}
          {type === 'map' && <MapIcon className={classes.widgetHeaderIcon} fontSize="small" />}
          {type === 'forecast' && <TimelineIcon className={classes.widgetHeaderIcon} fontSize="small" />}
          {type === 'alert' && <AlarmIcon className={classes.widgetHeaderIcon} fontSize="small" />}

          <Typography variant="subtitle1">
            {name}
          </Typography>

          <span className={classes.widgetHeaderSpacer} />

          <Popover
            open={Boolean(popoverAnchorEl)}
            anchorEl={popoverAnchorEl}
            onClose={this.handlePopoverClose}
            anchorOrigin={{
              vertical: 'center',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <Typography
              variant="caption"
              className={classes.popoverText}
            >
              {description}
            </Typography>
          </Popover>

          <div>
            {!isStatic &&
              <Tooltip title="Drag me!" placement="top">
                <IconButton
                  color="primary"
                  className={classes.smallerButton}
                >
                  <OpenWithIcon fontSize="small" className="draggableHandle" />
                </IconButton>
              </Tooltip>
            }
            <Tooltip title="Delete widget" placement="top">
              <span>
                <IconButton
                  color="primary"
                  className={classes.smallerButton}
                  onClick={this.handleDeleteWidgetClick}
                  disabled={!Boolean(description.length)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Widget info" placement="top">
              <span>
                <IconButton
                  color="primary"
                  className={classes.smallerButton}
                  onClick={this.handleShowInfoClick}
                  disabled={!Boolean(description.length)}
                >
                  <InfoIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Edit Widget" placement="top">
              <IconButton
                color="primary"
                className={classes.smallerButton}
                onClick={this.handleEditWidgetClick}
              >
                <SettingsIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <div className={classes.widgetBodyWrapper}>
          <div className={classes.widgetBodyContent}>
            {children}
          </div>
        </div>
      </Paper>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  openEditor: (mode, widgetProperties) => dispatch(openEditor(mode, widgetProperties)),
  openDeleteWidget: (widgetProperties) => dispatch(openDeleteWidget(widgetProperties)),
});

WidgetWrapper = withStyles(styles)(WidgetWrapper);
WidgetWrapper = connect(null, mapDispatchToProps)(WidgetWrapper);

export default WidgetWrapper
