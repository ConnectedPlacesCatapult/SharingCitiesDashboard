import React from "react";
import PropTypes from 'prop-types';
import {
  Modal,
  withStyles,
} from '@material-ui/core';
import { connect } from 'react-redux';

import Header from './../common/Header';
import SideBar from './../common/SideBar';
import WidgetMaker from './../common/WidgetMaker';
import OptionsSidePanel from './OptionsSidePanel';
import NoData from './NoData';
import AttributeTabs from './AttributeTabs';

const styles = (theme) => ({
  root: {
    display: 'flex',
    clear: 'both',
  },
  content: {
    flexGrow: 1,
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

class DataPage extends React.Component {
  state = {
    widgetModalOpen: false,
  };

  static propTypes = {
    classes: PropTypes.object.isRequired,
    api: PropTypes.object.isRequired,
  };

  openWidgetMaker = () => {
    this.setState({ widgetModalOpen: true })
  };

  handleWidgetMakerClose = () => {
    this.setState({ widgetModalOpen: false })
  };

  render() {
    const { classes, location, api } = this.props;

    return (
      <div className={classes.root}>
        <Header location={location} />
        <SideBar />
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          {api.fetched && api.data.length
            ? (
              <div className={classes.flexWrapper}>
                <AttributeTabs />
                <OptionsSidePanel openWidgetMaker={this.openWidgetMaker}
                />
              </div>
            )
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

const mapStateToProps = (state) => ({
  api: state.api,
});

DataPage = withStyles(styles)(DataPage);
DataPage = connect(mapStateToProps, {})(DataPage);

export default DataPage
