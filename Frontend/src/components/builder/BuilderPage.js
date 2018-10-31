import React, { Component } from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SideBar from './../common/SideBar';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'auto'
  },
  appBarSpacer: theme.mixins.toolbar,
});

class BuilderPage extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <SideBar />
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
        </main>
      </div>
    )
  }
}

BuilderPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BuilderPage);
