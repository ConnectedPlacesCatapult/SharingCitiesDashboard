import React from "react";
import PropTypes from 'prop-types';
import Typography from "@material-ui/core/Typography";
import Header from './../common/Header';
import Button from '@material-ui/core/Button';
import Paper from "@material-ui/core/Paper";
import AdminSettings from "./AdminSettings"

// material-ui
import { withStyles } from '@material-ui/core/styles';

import {initializeEditor} from "../../actions/widgetActions";
import {connect} from "react-redux";

const styles = (theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    //backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 4,
    height: '100vh',
    overflow: 'auto'
  },
  appBarSpacer: theme.mixins.toolbar,
});

class AdminPage extends React.Component {
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
          <AdminSettings/>
        </main>
      </div>
    )
  }
}

AdminPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  dashboard: state.dashboard,
});

const mapDispatchToProps = (dispatch) => ({
  initializeEditor: () => dispatch(initializeEditor()),
});

AdminPage = withStyles(styles)(AdminPage);
AdminPage = connect(mapStateToProps, mapDispatchToProps)(AdminPage);

export default AdminPage
