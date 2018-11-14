import React from 'react';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';


import Button from "@material-ui/core/Button";
import { connect } from 'react-redux';
import { setWidgetType } from "../../../actions/editorActions";

import PlotConfig from './PlotConfig';
import MapConfig from './MapConfig';

const styles = theme => ({
  root: {
    //display: 'flex',
  },
  formControl: {
    margin: theme.spacing.unit * 3,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },



  widgetTypeSelector: {
    display: 'flex',
  },
  widgetTypeButton: {
    margin: `${theme.spacing.unit}px`,
    marginLeft: 0,
  },
});

class TypeSelector extends React.Component {
  setWidgetType = e => {
    this.props.setWidgetType(e.currentTarget.value)
  };

  handleChange = e => {
    this.props.setWidgetType(e.target.value)
  };

  render() {
    const { classes, editor } = this.props;

    return (
      <div className={classes.root}>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Widget Type</FormLabel>
          <RadioGroup
            aria-label="Gender"
            name="gender1"
            className={classes.group}
            value={editor.type}
            onChange={this.handleChange}
          >
            <FormControlLabel value="plot" control={<Radio />} label="Plot" />
            <FormControlLabel value="map" control={<Radio />} label="Map" />
          </RadioGroup>
        </FormControl>



        {/*<div className={classes.widgetTypeSelector}>
          <Button
            className={classes.widgetTypeButton}
            onClick={this.setWidgetType}
            value="plot"
            variant="contained"
            color="primary"
          >
            Chart
          </Button>
          <Button
            className={classes.widgetTypeButton}
            onClick={this.setWidgetType}
            value="map"
            variant="contained"
            color="primary"
          >
            Map
          </Button>
        </div>*/}
        {
          editor.type === 'plot'
          ? <PlotConfig />
          : <MapConfig />
        }
      </div>
    )
  }
}

TypeSelector.propTypes = {
  classes: PropTypes.object.isRequired,
  editor: PropTypes.object.isRequired,
  setWidgetType: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  editor: state.editor,
});

const mapDispatchToProps = dispatch => ({
  setWidgetType: type => dispatch(setWidgetType(type)),
});

TypeSelector = withStyles(styles)(TypeSelector);

export default connect(mapStateToProps, mapDispatchToProps)(TypeSelector)
