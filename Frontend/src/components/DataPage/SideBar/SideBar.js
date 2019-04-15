import React from 'react';
import PropTypes from 'prop-types';

import ThemeList from './ThemeList';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';

// ToDo :: set this in fcc.config.js?
const drawerWidth = 240;

const styles = (theme) => ({
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
    backgroundColor: theme.palette.background.light,
  },
  appBarSpacer: theme.mixins.toolbar,
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
});

class SideBar extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <Drawer
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
        variant="permanent"
      >
        <div className={classes.appBarSpacer} />
        <div className={classes.appBarSpacer} />
        <ThemeList />
      </Drawer>
    )
  }
}

SideBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

SideBar = withStyles(styles)(SideBar);

export default SideBar
