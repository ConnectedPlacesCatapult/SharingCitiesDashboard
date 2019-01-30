import React from "react";
import PropTypes from 'prop-types';

import Header from './../common/Header';
import GridLayout from './GridLayout';

// material-ui
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    //backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'auto'
  },
  appBarSpacer: theme.mixins.toolbar,
});

class DashboardPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loginModalOpen: false
    }
  }

  render() {
    const { classes, location } = this.props;

    return (
      <div className={classes.root}>
        <Header location={location} />
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <GridLayout />
        </main>
      </div>
    )
  }
}

DashboardPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

DashboardPage = withStyles(styles)(DashboardPage);

export default DashboardPage
