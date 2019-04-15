import React from 'react';
import PropTypes from 'prop-types';
import {
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Switch,
  TextField,
  withStyles,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { setWidgetProperty } from './../../../actions/editorActions';

const styles = (theme) => ({
  root: {
    flexDirection: 'column',
    padding: theme.spacing.unit,
  },
  input: {
    color: theme.palette.primary.main
  },
  inputText: {
    color: theme.palette.primary.main
  }
});

class WidgetConfig extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    editor: PropTypes.object.isRequired,
    setWidgetProperty: PropTypes.func.isRequired,
  };

  setWidgetProperty = (property) => (e) => {
    this.props.setWidgetProperty(property, e.target.value)
  };

  setWidgetStatic = (e) => {
    this.props.setWidgetProperty('isStatic', e.target.checked)
  };

  render() {
    const { classes, editor } = this.props;

    return (
      <FormGroup className={classes.root}>
        <FormControl htmlFor="widget-name">
          <TextField
            InputProps={{className: classes.input}}
            className={classes.inputText}
            id="widget-name"
            label="Name"
            value={editor.widget.name}
            onChange={this.setWidgetProperty('name')}
            margin="normal"
            variant="outlined"
          />
        </FormControl>
        <FormControl htmlFor="widget-description">
          <TextField
            id="widget-description"
            label="Description"
            value={editor.widget.description}
            onChange={this.setWidgetProperty('description')}
            margin="normal"
            multiline={true}
            rows={3}
            variant="outlined"
          />
        </FormControl>
        <FormControl htmlFor="widget-width">
          <TextField
            id="widget-width"
            label="Width"
            value={editor.widget.width}
            onChange={this.setWidgetProperty('width')}
            margin="normal"
            variant="outlined"
          />
        </FormControl>
        <FormControl htmlFor="widget-height">
          <TextField
            id="widget-height"
            label="Height"
            value={editor.widget.height}
            onChange={this.setWidgetProperty('height')}
            margin="normal"
            variant="outlined"
          />
        </FormControl>
        <FormGroup row>
          <FormControlLabel
            label="Static"
            control={
              <Switch
                checked={editor.widget.isStatic}
                onChange={this.setWidgetStatic}
                value={editor.widget.isStatic}
                color="primary"
              />
            }
          />
        </FormGroup>
        <FormHelperText>If static is set the widget cannot be moved around the dashboard</FormHelperText>
      </FormGroup>
    )
  }
}

const mapStateToProps = (state) => ({
  editor: state.editor,
});

const mapDispatchToProps = (dispatch) => ({
  setWidgetProperty: (property, value) => dispatch(setWidgetProperty(property, value)),
});

WidgetConfig = withStyles(styles)(WidgetConfig);
WidgetConfig = connect(mapStateToProps, mapDispatchToProps)(WidgetConfig);

export default WidgetConfig
