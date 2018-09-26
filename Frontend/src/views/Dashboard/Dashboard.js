import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { NavLink } from 'react-router-dom';
import Grid from './Grid';

// ToDo: API call to get layout here
import LAYOUT_DATA from "../../data/layout3";

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  toolbar: theme.mixins.toolbar,
  toolbarTitle: {
    flexGrow: 1,
    marginLeft: '24px',
  },
  navLink: {
    textDecoration: 'none',
    color: 'black',
  },
  navLinkActive: {

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

class Dashboard extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <div className={classes.root}>
          <AppBar position="absolute" className={classes.appBar}>
            <Toolbar className={classes.toolbar}>
              <Typography variant="display1" color="inherit" noWrap className={classes.toolbarTitle}>
                Dashboard
              </Typography>
              <Button>
                <NavLink exact to="/" className={classes.navLink} activeClassName={classes.navLinkActive}>Dashboard</NavLink>
              </Button>
              <Button>
                <NavLink to="/dataviewer" className={classes.navLink} activeClassName={classes.navLinkActive}>DataViewer</NavLink>
              </Button>
            </Toolbar>
          </AppBar>
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Grid layoutData={LAYOUT_DATA} />
          </main>
        </div>
      </React.Fragment>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);