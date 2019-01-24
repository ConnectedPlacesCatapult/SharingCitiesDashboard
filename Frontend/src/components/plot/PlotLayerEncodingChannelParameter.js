import React from 'react';
import PropTypes from 'prop-types';

// redux
import { connect } from 'react-redux';
import {
  setPlotLayerEncodingChannelPropertyKey,
  setPlotLayerEncodingChannelPropertyValue,
  deletePlotLayerEncodingChannelProperty,
} from "../../actions/plotActions";

// material-ui
import { withStyles } from '@material-ui/core/styles';
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from "@material-ui/icons/Delete";

const styles = theme => ({
  root: {

  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
    border: '1px solid black',
  },
  button: {
    margin: theme.spacing.unit,
  },
});

class PlotLayerEncodingChannelParameter extends React.Component {
  getDataFieldNamesFromData = () => {
    if (this.props.plot.data.values.length) {
      return Object.keys(this.props.plot.data.values[0])
    }

    return []
  };

  setPlotLayerEncodingChannelPropertyKey = (layerIndex, channelKey, currentPropertyKey) => e => {
    if (currentPropertyKey === e.target.value) return;

    this.props.setPlotLayerEncodingChannelPropertyKey(layerIndex, channelKey, currentPropertyKey, e.target.value)
  };

  setPlotLayerEncodingChannelPropertyValue = (layerIndex, channelKey, propertyKey, currentPropertyValue) => e => {
    if (currentPropertyValue === e.target.value) return;

    this.props.setPlotLayerEncodingChannelPropertyValue(layerIndex, channelKey, propertyKey, e.target.value)
  };

  deletePlotLayerEncodingChannelProperty = (layerIndex, channelKey, propertyKey) => e => {
    this.props.deletePlotLayerEncodingChannelProperty(layerIndex, channelKey, propertyKey)
  };

  render() {
    const { classes, config, plot, layerIndex, channelKey, propertyKey, propertyValue, getMenuItems } = this.props;

    /**
     * for reference
     *
     const encodingChannelMenuItems = () => {
      const all = config.vega.encodingChannels;
      const existing = Object.keys(plot.spec.layer[layerIndex].encoding);
      const current = channelKey;

      return all.map((item, i) => {
        return (
          <MenuItem
            key={i}
            value={item}
            disabled={existing.includes(item) && current !== item}
          >
            {item}
          </MenuItem>
        )
      });
    };
     */

    const getValueOptions = () => {
      switch (propertyKey) {
        case "field": {
          return getMenuItems(this.getDataFieldNamesFromData())
        }

        case "type": {
          return getMenuItems(config.vega.encodingChannelTypes)
        }

        case "aggregate": {
          return getMenuItems(config.vega.encodingChannelAggregates)
        }
      }
    };

    return (
      <div className={classes.root}>
        <FormControl className={classes.formControl}>
          <Select
            onChange={this.setPlotLayerEncodingChannelPropertyKey(layerIndex, channelKey, propertyKey)}
            value={propertyKey}
          >
            {getMenuItems(config.vega.encodingChannelFields)}
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <Select
            onChange={this.setPlotLayerEncodingChannelPropertyValue(layerIndex, channelKey, propertyKey, propertyValue)}
            value={propertyValue}
          >
            {getValueOptions()}
          </Select>
        </FormControl>
        <IconButton
          className={classes.button}
          aria-label="Delete property"
          color="primary"
          onClick={this.deletePlotLayerEncodingChannelProperty(layerIndex, channelKey, propertyKey)}
        >
          <DeleteIcon />
        </IconButton>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  config: state.config.config,
  plot: state.plot,
});

const mapDispatchToProps = (dispatch) => ({
  setPlotLayerEncodingChannelPropertyKey: (layerIndex, channelKey, currentPropertyKey, newPropertyKey) => dispatch(setPlotLayerEncodingChannelPropertyKey(layerIndex, channelKey, currentPropertyKey, newPropertyKey)),
  setPlotLayerEncodingChannelPropertyValue: (layerIndex, channelKey, propertyKey, newValue) => dispatch(setPlotLayerEncodingChannelPropertyValue(layerIndex, channelKey, propertyKey, newValue)),
  deletePlotLayerEncodingChannelProperty: (layerIndex, channelKey, propertyKey) => dispatch(deletePlotLayerEncodingChannelProperty(layerIndex, channelKey, propertyKey)),
});

PlotLayerEncodingChannelParameter.propTypes = {
  classes: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  plot: PropTypes.object.isRequired,
};

PlotLayerEncodingChannelParameter = withStyles(styles)(PlotLayerEncodingChannelParameter);
PlotLayerEncodingChannelParameter = connect(mapStateToProps, mapDispatchToProps)(PlotLayerEncodingChannelParameter);

export default PlotLayerEncodingChannelParameter
