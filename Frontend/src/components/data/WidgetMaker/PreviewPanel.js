import React from 'react';
import PropTypes from "prop-types";
import classNames from 'classnames';
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TitleIcon from '@material-ui/icons/Title';
import TextField from '@material-ui/core/TextField'
import { connect } from 'react-redux';
import { setWidgetName } from "../../../actions/editorActions";

import MapPreview from './MapPreview';
import PlotPreview from './PlotPreview';

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: `${theme.spacing.unit}px`,
    maxWidth: theme.spacing.unit * 80,
    overflow: 'auto',
  },
  paper: {

  },
  textField: {

  },
});

class PreviewPanel extends React.Component {
  setWidgetName= e => {
    this.props.setWidgetName(e.target.value)
  };

  render() {
    const { classes, editor } = this.props;

    return (
      <Paper className={classNames(classes.root, classes.paper)}>
        <TitleIcon />
        <TextField
          id="standard-bare"
          className={classes.textField}
          defaultValue={editor.name}
          margin="normal"
          onChange={this.setWidgetName}
        />
        {
          editor.type === 'plot'
          ? <PlotPreview />
          : <MapPreview />
        }
      </Paper>
    )
  }
}

PreviewPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  editor: PropTypes.object.isRequired,
  setWidgetName: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  editor: state.editor,
});

const mapDispatchToProps = dispatch => ({
  setWidgetName: name => dispatch(setWidgetName(name)),
});

PreviewPanel = withStyles(styles)(PreviewPanel);

export default connect(mapStateToProps, mapDispatchToProps)(PreviewPanel)
