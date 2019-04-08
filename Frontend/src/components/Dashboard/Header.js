import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  AppBar,
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  withStyles,
} from '@material-ui/core';
import MapIcon from '@material-ui/icons/Map';
import BarChartIcon from '@material-ui/icons/BarChart';
import TimelineIcon from '@material-ui/icons/Timeline';
import AlarmIcon from '@material-ui/icons/Alarm';
import AddIcon from '@material-ui/icons/Add';
import { connect } from 'react-redux';
import { openEditor } from '../../actions/editorActions';

// ToDo :: add this to config and define a default logo (somewhere)
const bgImage = require('./../../images/Lisbon-logo-med.png');

const styles = (theme) => ({
  root: {
    margin: '30px 0',
    boxShadow: 'none',
  },
  grow: {
    flexGrow: 1,
  },
  toolbarLogo: {
    position: 'absolute',
    left: theme.spacing.unit,
  },
  iconLeft: {
    marginRight: theme.spacing.unit,
  },
  button: {
    margin: `0 ${theme.spacing.unit}px`,
  },
});

class Header extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    openEditor: PropTypes.func.isRequired,
  };

  state = {
    menuAnchorEl: null,
  };

  handleOpenMenuClicked = (e) => {
    this.setState({ menuAnchorEl: e.currentTarget })
  };

  handleCloseMenu = () => {
    this.setState({ menuAnchorEl: null })
  };

  handleCreateWidgetClicked = (type) => {
    this.handleCloseMenu();

    this.props.openEditor('add', { type })
  };

  render() {
    const { classes } = this.props;
    const { menuAnchorEl } = this.state;

    return (
      <AppBar position="absolute" color="default" className={classes.root}>
        <Toolbar className={classes.toolbar} disableGutters>
          <img className={classes.toolbarLogo} src={bgImage} width="220px" height="auto" />
          <span className={classes.grow} />
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={this.handleCloseMenu}
          >
            <MenuItem onClick={() => this.handleCreateWidgetClicked('plot')}>
              <ListItemIcon>
                <BarChartIcon />
              </ListItemIcon>
              <ListItemText primary="Plot widget" />
            </MenuItem>
            <MenuItem onClick={() => this.handleCreateWidgetClicked('map')}>
              <ListItemIcon>
                <MapIcon />
              </ListItemIcon>
              <ListItemText primary="Map widget" />
            </MenuItem>
            <MenuItem onClick={() => this.handleCreateWidgetClicked('forecast')}>
              <ListItemIcon>
                <TimelineIcon />
              </ListItemIcon>
              <ListItemText primary="Forecast widget" />
            </MenuItem>
            <MenuItem onClick={() => this.handleCreateWidgetClicked('alert')}>
              <ListItemIcon>
                <AlarmIcon />
              </ListItemIcon>
              <ListItemText primary="Alert widget" />
            </MenuItem>
          </Menu>
          <Button
            className={classes.button}
            size="small"
            color="primary"
            variant="outlined"
            onClick={this.handleOpenMenuClicked}
          >
            <AddIcon className={classNames(classes.iconLeft, classes.iconSmall)} />
            New Widget
          </Button>
          <Button
            className={classes.button}
            size="small"
            color="secondary"
            variant="outlined"
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  openEditor: (widgetType, widgetProperties) => dispatch(openEditor(widgetType, widgetProperties)),
});

Header = withStyles(styles)(Header);
Header = connect(null, mapDispatchToProps)(Header);

export default Header
