import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';

import ThemeList from './ThemeList';

const drawerWidth = 240;

const styles = theme => ({
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
    backgroundColor: theme.palette.primary.main,
  },
  appBarSpacer: theme.mixins.toolbar,
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
});

class SideBar extends Component {
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

export default withStyles(styles)(SideBar);
