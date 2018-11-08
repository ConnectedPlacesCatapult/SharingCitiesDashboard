import React, { Component } from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SideBar from './../common/SideBar';
import { connect } from 'react-redux';

import DataTable from './DataTable';
import NoData from './NoData';

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
    const { classes, data } = this.props;

    return (
      <div className={classes.root}>
        <SideBar />
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          {
            data.fetched
            ? <DataTable />
            : <NoData />
          }
        </main>
      </div>
    )
  }
}

DataPage.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  data: state.data,
});

const mapDispatchToProps = dispatch => ({

});

DataPage = withStyles(styles)(DataPage);

export default connect(mapStateToProps, mapDispatchToProps)(DataPage);
