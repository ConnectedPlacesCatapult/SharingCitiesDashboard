import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  withStyles,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { saveWidget } from './../../actions/editorActions';
import {
  EDITOR_MODE_ADD
} from './../../constants';
import ConfigWrapper from './config/ConfigWrapper';
import PreviewWrapper from './preview/PreviewWrapper';


const styles = (theme) => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {

  },
});

class Editor extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  handleSaveWidgetClicked = () => {
    const { editor, saveWidget } = this.props;

    saveWidget(editor.mode, editor.widget);
  };

  render() {
    const { classes, editor } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.row}>
          <ConfigWrapper/>
          <PreviewWrapper/>
        </div>
        <Button
          className={classes.actionButton}
          variant="contained"
          color="secondary"
          onClick={this.handleSaveWidgetClicked}
        >
          {editor.mode === EDITOR_MODE_ADD ? "Save Widget" : "Update Widget"}
        </Button>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  editor: state.editor,
});

const mapDispatchToProps = (dispatch) => ({
  saveWidget: (mode, widget) => dispatch(saveWidget(mode, widget)),
});

Editor = withStyles(styles)(Editor);
Editor = connect(mapStateToProps, mapDispatchToProps)(Editor);

export default Editor
