import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  withStyles,
  Dialog
} from '@material-ui/core';
import { connect } from 'react-redux';
import { closeEditor } from '../../actions/editorActions';
import { closeDeleteWidget, deleteWidget } from '../../actions/dashboardActions';
import Header from './../common/Header';
import GridLayout from './GridLayout';
import Editor from './../Editor';
import DeleteWidgetDialog from './../common/DeleteWidgetDialog'

const styles = (theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 2}px `,
    height: '100vh',
    overflow: 'auto'
  },
  appBarSpacer: theme.mixins.toolbar,
});

class Dashboard extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    editor: PropTypes.object.isRequired,
    closeEditor: PropTypes.func.isRequired,
    closeDeleteWidget: PropTypes.func.isRequired,
  };

  handleEditorClose = () => {
    const { closeEditor } = this.props;

    closeEditor();
  };

  handleDeleteWidgetClose = () => {
    const { i, closeDeleteWidget } = this.props;
    closeDeleteWidget(i)
  };

  handleDeleteWidget = () => {
    const { i, deleteWidget, user } = this.props;
    deleteWidget(i, user)
  };

  render() {
    const { classes, editor, dashboard } = this.props;

    return (
      <div className={classes.root}>
        <Header />
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <GridLayout />
        </main>
        <Modal
          open={editor.open}
          onClose={this.handleEditorClose}
          disableAutoFocus={true}
        >
          <Editor />
        </Modal>

        <Dialog
          open={dashboard.deleteWidgetDialogOpen}
          onClose={this.props.closeDeleteWidget}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DeleteWidgetDialog cancelDelete={this.handleDeleteWidgetClose} deleteWidget={this.handleDeleteWidget}/>
        </Dialog>

        {/*deleteWidgetDialogOpen*/}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  editor: state.editor,
  dashboard: state.dashboard,
  user: state.dashboard,
});

const mapDispatchToProps = (dispatch) => ({
  closeEditor: () => dispatch(closeEditor()),
  closeDeleteWidget: () => dispatch(closeDeleteWidget()),
});

Dashboard = withStyles(styles)(Dashboard);
Dashboard = connect(mapStateToProps, mapDispatchToProps)(Dashboard);

export default Dashboard
