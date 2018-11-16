import React from 'react';
import PropTypes from "prop-types";
import classNames from 'classnames';
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import TitleIcon from '@material-ui/icons/Title';
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
  formControl: {
    margin: theme.spacing.unit,
    minWidth: theme.spacing.unit * 20,
  },
  textField: {

  },
  input: {
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.secondary,
  }
});

class PreviewPanel extends React.Component {
  setWidgetName= e => {
    this.props.setWidgetName(e.target.value)
  };

  render() {
    const { classes, editor } = this.props;

    return (
      <Paper className={classNames(classes.root, classes.paper)}>

        <FormControl className={classes.formControl}>
          <Input
            id="widget-name"
            className={classes.textField}
            defaultValue={editor.name}
            onChange={this.setWidgetName}
            inputProps={{
              root: classes.input,
              className: classes.input
            }}
            startAdornment={
              <InputAdornment position="start">
                <TitleIcon color="primary" />
              </InputAdornment>
            }
          />
        </FormControl>
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
