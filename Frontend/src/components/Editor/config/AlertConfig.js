import React from 'react';
import PropTypes from 'prop-types';
import {
  Divider,
  FormControl,
  FormGroup,
  TextField,
  withStyles,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { setWidgetConfigProperty } from './../../../actions/editorActions';

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  divider: {
    margin: `${theme.spacing.unit}px 0`,
  },
});

class AlertConfig extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  setAlertProperty = (property) => (e) => {
    const { setWidgetConfigProperty } = this.props;

    setWidgetConfigProperty(property, e.target.value)
  };

  render() {
    const { classes, editor } = this.props;

    return (
      <FormGroup className={classes.root}>
        <Divider className={classes.divider} />
        <FormControl htmlFor="alert-something">
          <TextField
            id="alert-something"
            label="Something"
            value={editor.widget.config.something}
            onChange={this.setAlertProperty('something')}
          />
        </FormControl>
        alert options go here
      </FormGroup>
    )
  }
}

const mapStateToProps = (state) => ({
  editor: state.editor,
});

const mapDispatchToProps = (dispatch) => ({
  setWidgetConfigProperty: (property, value) => dispatch(setWidgetConfigProperty(property, value)),
});

AlertConfig = withStyles(styles)(AlertConfig);
AlertConfig = connect(mapStateToProps, mapDispatchToProps)(AlertConfig);

export default AlertConfig
