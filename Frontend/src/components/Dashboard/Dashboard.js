import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Modal,
  withStyles,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { closeEditor } from '../../actions/editorActions';
import CreateWidgetMenu from './../common/CreateWidgetMenu';
import Editor from './../Editor';
import GridLayout from './GridLayout';
import Header from './../common/Header';

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

  state = {
    createWidgetMenuAnchorEl: null,
  };

  handleEditorClose = () => {
    const { closeEditor } = this.props;

    closeEditor();
  };

  handleCreateWidgetClicked = (e) => {
    this.setState({ createWidgetMenuAnchorEl: e.currentTarget })
  };

  handleCloseCreateWidgetMenu = () => {
    this.setState({ createWidgetMenuAnchorEl: null })
  };

  render() {
    const { classes, editor } = this.props;
    const { createWidgetMenuAnchorEl } = this.state;

    return (
      <div className={classes.root}>
        <Header />
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <GridLayout />
          <CreateWidgetMenu
            mode="edit"
            anchorEl={createWidgetMenuAnchorEl}
            onClose={this.handleCloseCreateWidgetMenu}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleCreateWidgetClicked}
          >
            Create Widget
          </Button>
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
