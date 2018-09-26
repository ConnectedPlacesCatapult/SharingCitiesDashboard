import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import { lighten } from "@material-ui/core/styles/colorManipulator";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Drawer from "@material-ui/core/Drawer";
import Typography from '@material-ui/core/Typography';
import MenuIcon from "@material-ui/icons/Menu";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import { NavLink } from "react-router-dom";
import DataSourceList from './DataSourceList';
import DataSourceTable from './DataSourceTable';

// ToDo: API call to get themes here
import THEME_DATA from "../../data/themes";

const drawerWidth = 240;
const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  toolbar: theme.mixins.toolbar,
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  navLink: {
    textDecoration: 'none',
    color: 'black',
  },
  navLinkActive: {

  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    backgroundColor: lighten(theme.palette.secondary.light, 0.5),
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'auto'
  },
  appBarSpacer: theme.mixins.toolbar
});

class DataViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: true,
      activeDataSource: null
    }
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  onDataSourceSelected = dataSource => {
    this.setState({ activeDataSource: dataSource });
  };

  render() {
    const { classes } = this.props;
    const { activeDataSource, open } = this.state;

    const sources = [];
    THEME_DATA.forEach(function(theme) {
      theme.sources.forEach((source) => {
        sources.push(source);
      })
    });

    const dataSourceTables = sources.map((source, i) => {
      return <DataSourceTable key={i} active={source.name === this.state.activeDataSource} {...source} />
    });

    return (
      <React.Fragment>
        <div className={classes.root}>
          <AppBar position="absolute" className={classes.appBar}>
            <Toolbar disableGutters={false} className={classes.toolbar}>
              <IconButton
                color="inherit"
                aria-label="Toggle drawer"
                onClick={open ? this.handleDrawerClose : this.handleDrawerOpen}
                className={classes.menuButton}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="display1" color="inherit" noWrap className={classes.toolbarTitle}>
                DataViewer
              </Typography>

              <Button>
                <NavLink exact to="/" className={classes.navLink} activeClassName={classes.navLinkActive}>Dashboard</NavLink>
              </Button>
              <Button>
                <NavLink to="/dataviewer" className={classes.navLink} activeClassName={classes.navLinkActive}>DataViewer</NavLink>
              </Button>
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" classes={{ paper: classNames(classes.drawerPaper, !open && classes.drawerPaperClose) }} open={open}>
            <div className={classes.appBarSpacer} />
            <DataSourceList themes={THEME_DATA} activeDataSource={activeDataSource} onDataSourceSelected={this.onDataSourceSelected} openDrawer={this.handleDrawerOpen} />
          </Drawer>
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            {dataSourceTables}
          </main>
        </div>
      </React.Fragment>
    )
  }
}

DataViewer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DataViewer);