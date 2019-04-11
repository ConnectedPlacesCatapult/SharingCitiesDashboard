import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  withStyles,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { closeEditor } from '../../actions/editorActions';
import Header from './../common/Header';
import SideBar from './SideBar';
import OptionsSidePanel from './OptionsSidePanel';
import NoData from './NoData';
import AttributeTabs from './AttributeTabs';
import Editor from './../Editor';

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
  static propTypes = {
    classes: PropTypes.object.isRequired,
    editor: PropTypes.object.isRequired,
    dataTable: PropTypes.object.isRequired,
  };

  handleEditorClose = () => {
    const { closeEditor } = this.props;

    closeEditor();
  };

  render() {
    const { classes, location, dataTable, editor } = this.props;

    return (
      <div className={classes.root}>
        <Header location={location} />
        <SideBar />
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          {dataTable.fetched && dataTable.data.length
            ? (
              <div className={classes.flexWrapper}>
                <AttributeTabs />
                <OptionsSidePanel />
              </div>
            )
            : <NoData />
          }
        </main>
        <Modal
          open={editor.open}
          onClose={this.handleEditorClose}
          disableAutoFocus={true}
        >
          <Editor />
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  editor: state.editor,
  dataTable: state.dataTable,
});

const mapDispatchToProps = (dispatch) => ({
  closeEditor: () => dispatch(closeEditor()),
});

DataPage = withStyles(styles)(DataPage);
DataPage = connect(mapStateToProps, mapDispatchToProps)(DataPage);

export default DataPage
