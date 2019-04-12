import React from 'react';
import PropTypes from 'prop-types';
import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  withStyles
} from '@material-ui/core';
import AlarmIcon from '@material-ui/icons/Alarm';
import BarChartIcon from '@material-ui/icons/BarChart';
import MapIcon from '@material-ui/icons/Map';
import TimelineIcon from '@material-ui/icons/Timeline';
import { connect } from 'react-redux';
import { openEditor } from './../../../actions/editorActions';

const styles = (theme) => ({
  root: {

  },
});

class CreateWidgetMenu extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    mode: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    openEditor: PropTypes.func.isRequired,
  };

  static defaultProps = {
    anchorEl: null,
    enablePlot: true,
    enableMap: true,
    enableForecast: true,
    enableAlert: true,
  };

  constructor(props) {
    super(props);

    this.state = {
      enablePlot: props.enablePlot,
      enableMap: props.enableMap,
      enableForecast: props.enableForecast,
      enableAlert: props.enableAlert,
    }
  }

  handleTypeClicked = (type) => {
    const { editorMode, onClose, openEditor } = this.props;

    onClose();
    openEditor(editorMode, { type })
  };

  handleClose = () => {
    const { onClose } = this.props;

    onClose()
  };

  render() {
    const { classes, anchorEl } = this.props;
    const { enablePlot, enableMap, enableForecast, enableAlert } = this.state;

    return (
      <Menu
        className={classes.root}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={this.handleClose}
      >
        {enablePlot &&
          <MenuItem onClick={() => this.handleTypeClicked('plot')}>
            <ListItemIcon>
              <BarChartIcon />
            </ListItemIcon>
            <ListItemText primary="Plot widget" />
          </MenuItem>
        }
        {enableMap &&
          <MenuItem onClick={() => this.handleTypeClicked('map')}>
            <ListItemIcon>
              <MapIcon/>
            </ListItemIcon>
            <ListItemText primary="Map widget"/>
          </MenuItem>
        }
        {enableForecast &&
          <MenuItem onClick={() => this.handleTypeClicked('forecast')}>
            <ListItemIcon>
              <TimelineIcon />
            </ListItemIcon>
            <ListItemText primary="Forecast widget" />
          </MenuItem>
        }
        {enableAlert &&
          <MenuItem onClick={() => this.handleTypeClicked('alert')}>
            <ListItemIcon>
              <AlarmIcon />
            </ListItemIcon>
            <ListItemText primary="Alert widget" />
          </MenuItem>
        }
      </Menu>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  openEditor: (mode, properties) => dispatch(openEditor(mode, properties)),
});

CreateWidgetMenu = withStyles(styles)(CreateWidgetMenu);
CreateWidgetMenu = connect(null, mapDispatchToProps)(CreateWidgetMenu);

export default CreateWidgetMenu
