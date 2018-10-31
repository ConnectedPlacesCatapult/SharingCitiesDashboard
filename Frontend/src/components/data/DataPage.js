import React, { Component } from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SideBar from './../common/SideBar';

import DataSourceTable from './DatasourceTable';

// fake data
import THEME_DATA from './../../data/dataThemes';

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

class DataPage extends Component {
  render() {
    const { classes } = this.props;

    const datasourceTables = THEME_DATA.map((theme) => {
      return theme.sources.map((source, i) => {
        return <DataSourceTable key={i} active={source.name === "Weather Forecast"} {...source} />
      })
    });

    return (
      <div className={classes.root}>
        <SideBar />
        <main className={classes.content}>
          {/*<div className={classes.appBarSpacer} />*/}
          <div className={classes.appBarSpacer} />
          {datasourceTables}
        </main>
      </div>
    )
  }
}

DataPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DataPage);
