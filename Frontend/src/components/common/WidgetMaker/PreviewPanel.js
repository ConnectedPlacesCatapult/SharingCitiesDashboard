import React from 'react';
import PropTypes from "prop-types";

import MapPreview from './MapPreview';
import PlotPreview from './PlotPreview';
import AlertPreview from './AlertPreview';

// material-ui
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import TitleIcon from '@material-ui/icons/Title';

// redux
import { connect } from 'react-redux';
import { setWidgetProperty } from "../../../actions/widgetActions";

// misc utils
import classNames from 'classnames';

const styles = (theme) => ({
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
    //color: theme.palette.primary.main,
    //borderColor: theme.palette.primary.secondary,
  }
});

class PreviewPanel extends React.Component {
  setWidgetName = (e) => {
    this.props.setWidgetName(e.target.value)
  };

  updateWidgetProperty = (property) => (e) => {
    this.props.setWidgetProperty(property, e.target.value)
  };

  render() {
    const { classes, widget } = this.props;

    return (
      <Paper className={classNames(classes.root, classes.paper)}>
        <FormControl className={classes.formControl}>
          <Input
            id="widget-name"
            className={classes.textField}
            defaultValue={widget.name}
            onChange={this.updateWidgetProperty('name')}
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
        { widget.type === 'plot' && <PlotPreview /> }
        { widget.type === 'map' && <MapPreview /> }
        { widget.type === 'alert' && <AlertPreview /> }
      </Paper>
    )
  }
}

PreviewPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  widget: PropTypes.object.isRequired,
  setWidgetProperty: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  widget: state.widget,
});

const mapDispatchToProps = (dispatch) => ({
  setWidgetProperty: (property, value) => dispatch(setWidgetProperty(property, value)),
});

PreviewPanel = withStyles(styles)(PreviewPanel);
PreviewPanel = connect(mapStateToProps, mapDispatchToProps)(PreviewPanel);

export default PreviewPanel
