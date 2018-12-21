import React, { Component } from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { connect } from 'react-redux';

import Header from './../common/Header';
import SideBar from './../common/SideBar';
import DataTable from './DataTable';
import OptionsSidePanel from './OptionsSidePanel';
import NoData from './NoData';
import WidgetMaker from './WidgetMaker';

const styles = theme => ({
  root: {
    display: 'flex',
    clear: 'both',
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'auto',
  },
  appBarSpacer: theme.mixins.toolbar,
  flexWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing.unit * 3,
  },
});

class DataPage extends Component {
  state = {
    widgetModalOpen: false,
  };

  openWidgetMaker = () => {
    this.setState({ widgetModalOpen: true })
  };

  handleWidgetMakerClose = () => {
    this.setState({ widgetModalOpen: false })
  };

  render() {
    const { classes, location, data } = this.props;

    return (
      <div className={classes.root}>
        <Header location={location} />
        <SideBar />
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          {
            data.fetched
            ? <div className={classes.flexWrapper}>
                {/*<DataTable />*/}
                <OptionsSidePanel
                  openWidgetMaker={this.openWidgetMaker}
                />
              </div>
            : <NoData />
          }
        </main>
        <Modal
          open={this.state.widgetModalOpen}
          onClose={this.handleWidgetMakerClose}
          disableAutoFocus={true}
        >
          <WidgetMaker />
        </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(DataPage)
