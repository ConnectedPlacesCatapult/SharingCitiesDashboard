import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  withStyles,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { setWidgetProperty } from '../../../actions/widgetActions';

import PlotConfig from './PlotConfig';
import MapConfig from './MapConfig';
import AlertConfig from './AlertConfig';

const styles = (theme) => ({
  root: {

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
  static propTypes = {
    classes: PropTypes.object.isRequired,
    widget: PropTypes.object.isRequired,
    setWidgetProperty: PropTypes.func.isRequired,
  };

  setWidgetType = (e) => {
    this.props.setWidgetProperty('type', e.currentTarget.value)
  };

  render() {
    const { classes, widget } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.widgetTypeSelector}>
          <Button
            className={classes.widgetTypeButton}
            onClick={this.setWidgetType}
            value="plot"
            variant="contained"
            color="primary"
          >
            Plot
          </Button>
          <Button
            className={classes.widgetTypeButton}
            onClick={this.setWidgetType}
            value="map"
            variant="contained"
            color="primary"
            disabled={!widget.isMappable}
          >
            Map
          </Button>
          <Button
            className={classes.widgetTypeButton}
            onClick={this.setWidgetType}
            value="alert"
            variant="contained"
            color="primary"
          >
            Alert
          </Button>
        </div>
        { widget.type === 'plot' && <PlotConfig /> }
        { widget.type === 'map' && <MapConfig /> }
        { widget.type === 'alert' && <AlertConfig /> }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  widget: state.widget,
});

const mapDispatchToProps = (dispatch) => ({
  setWidgetProperty: (property, value) => dispatch(setWidgetProperty(property, value)),
});

TypeSelector = withStyles(styles)(TypeSelector);
TypeSelector = connect(mapStateToProps, mapDispatchToProps)(TypeSelector);

export default TypeSelector
