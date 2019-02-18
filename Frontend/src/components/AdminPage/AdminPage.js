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

// redux
import { connect } from 'react-redux';
import {
  fetchAdmin
} from "./../../actions/apiActions";

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
    //
    this.props.fetchAdmin()
  }

  render() {
    const { adminItems, classes, location } = this.props;

    console.log(adminItems)

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
  // adminItems: PropTypes.array.isRequired,
  fetchAdmin: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  api: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  api: state.api,
});

const mapDispatchToProps = (dispatch) => ({
  fetchAdmin: () => dispatch(fetchAdmin()),
  initializeEditor: () => dispatch(initializeEditor()),
});

AdminPage = withStyles(styles)(AdminPage);
AdminPage = connect(mapStateToProps, mapDispatchToProps)(AdminPage);

export default AdminPage
