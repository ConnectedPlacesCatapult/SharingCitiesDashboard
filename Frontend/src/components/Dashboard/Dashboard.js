import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Modal,
  withStyles,
} from '@material-ui/core';
import BarChartIcon from '@material-ui/icons/BarChart';
import MapIcon from '@material-ui/icons/Map';
import AlertIcon from '@material-ui/icons/Notifications';
import { connect } from 'react-redux';
import { closeEditor } from '../../actions/editorActions';
import CreateWidgetMenu from './../common/CreateWidgetMenu';
import Editor from './../Editor';
import GridLayout from './GridLayout';
import NoWidgets from './NoWidgets';
import Header from './../common/Header';
import { saveLayout } from '../../actions/dashboardActions';

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
  createWidgetContainer: {
    margin: '2em 1em',
    position: 'fixed',
    bottom: 0
  },
  saveLayout: {
    marginLeft: '1em'
  }
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

  handleSaveLayoutClick = () => {
    const { saveLayout } = this.props;
    saveLayout();
  };


  noWidgetsPrompt() {
    const { dashboard } = this.props;
    if (dashboard && dashboard.fetched === true && dashboard.widgets && dashboard.widgets.length === 0) {
      return <NoWidgets/>
    }
  }

  layoutChanged() {
    const { dashboard, classes } = this.props;
    if (dashboard && dashboard.layoutChanged === true) {
      return <Button
        variant="contained"
        color="primary"
        className={classes.saveLayout}
        onClick={this.handleSaveLayoutClick}
      >
        Save Layout
      </Button>
    }
  }

  render() {
    const { classes, editor, dashboard } = this.props;
    const { createWidgetMenuAnchorEl } = this.state;

    return (
      <div className={classes.root}>
        <Header />
        <main className={classes.content}>
          <div className={classes.appBarSpacer}/>
          {this.noWidgetsPrompt()}
          <GridLayout />
          <div className={classes.createWidgetContainer}>
            <CreateWidgetMenu
              mode="add"
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
            {this.layoutChanged()}
          </div>
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
  dashboard: state.dashboard,
});

const mapDispatchToProps = (dispatch) => ({
  closeEditor: () => dispatch(closeEditor()),
  saveLayout: () => dispatch(saveLayout()),
});

Dashboard = withStyles(styles)(Dashboard);
Dashboard = connect(mapStateToProps, mapDispatchToProps)(Dashboard);

export default Dashboard
