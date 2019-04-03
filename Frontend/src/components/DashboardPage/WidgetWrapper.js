import React from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Popover,
  Modal,
  withStyles,
} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import InfoIcon from '@material-ui/icons/Info';
import OpenWithIcon from '@material-ui/icons/OpenWith';
import WidgetMaker from './../common/WidgetMaker';

const styles = (theme) => ({
  widget: {
    borderRadius: '3px',
    padding: theme.spacing.unit,
    height: '100%',
  },
  widgetHeader: {
    overflow: 'hidden',
    paddingLeft: theme.spacing.unit * 0.5,
    color: theme.palette.text.primary,
  },
  widgetTitle: {
    flexGrow: 1,
    float: 'left',
  },
  widgetButtons: {
    display: 'block',
    float: 'right',
  },
  widgetBodyWrapper: {
    overflow: 'hidden',
    position: 'relative',
    height: '100%',
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
  state = {
    popoverAnchorEl: null,
    widgetModalOpen: false,
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

  openWidgetMaker = () => {
    this.setState({ widgetModalOpen: true })
  };

  handleEditWidgetClick = () => {
    this.openWidgetMaker()
  };

  handleWidgetMakerClose = () => {
    this.setState({ widgetModalOpen: false })
  };

  render() {
    const { classes } = this.props;
    const { popoverAnchorEl } = this.state;

    return (
      <Paper className={classes.widget}>
        <div className={classes.widgetHeader}>
          <Typography variant="subtitle1" className={classes.widgetTitle}>
            {this.props.name}
          </Typography>

          <Popover
            open={Boolean(popoverAnchorEl)}
            anchorEl={popoverAnchorEl}
            onClose={this.handlePopoverClose}
          >
            <Typography
              variant="caption"
              className={classes.popoverText}
            >
              {this.props.description}
            </Typography>
          </Popover>

          <div className={classes.widgetButtons}>
            { !this.props.isStatic &&
            <Tooltip title="Drag me!" placement="top">
              <IconButton
                color="primary"
                className={classes.smallerButton}
              >
                <OpenWithIcon fontSize="small" className="draggableHandle" />
              </IconButton>
            </Tooltip>
            }
            <Tooltip title="Widget info" placement="top">
              <span>
                <IconButton
                  color="primary"
                  className={classes.smallerButton}
                  onClick={this.handleShowInfoClick}
                  disabled={!Boolean(this.props.description.length)}
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
            {this.props.children}
          </div>
        </div>
        <Modal
          open={this.state.widgetModalOpen}
          onClose={this.handleWidgetMakerClose}
          disableAutoFocus={true}
        >
          <WidgetMaker />
        </Modal>
      </Paper>
    )
  }
}

WidgetWrapper.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  isStatic: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

WidgetWrapper = withStyles(styles)(WidgetWrapper);

export default WidgetWrapper
