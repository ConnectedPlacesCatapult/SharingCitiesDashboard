import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  withStyles,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { closeEditor } from '../../actions/editorActions';
import Header from './../common/Header';
import GridLayout from './GridLayout';
import Editor from './../Editor';

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
  };

  handleEditorClose = () => {
    const { closeEditor } = this.props;

    closeEditor();
  };

  render() {
    const { classes, editor } = this.props;

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
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  editor: state.editor,
});

const mapDispatchToProps = (dispatch) => ({
  closeEditor: () => dispatch(closeEditor()),
});

Dashboard = withStyles(styles)(Dashboard);
Dashboard = connect(mapStateToProps, mapDispatchToProps)(Dashboard);

export default Dashboard
