import React from 'react';
import PropTypes from 'prop-types';

import PlotLayerEncodingChannelParameter from './PlotLayerEncodingChannelParameter';

// redux
import { connect } from 'react-redux';
import {
  setPlotLayerEncodingChannelKey,
  addPlotLayerEncodingChannelProperty,
  deletePlotLayerEncodingChannel,
} from "../../actions/plotActions";

// material-ui
import { withStyles } from '@material-ui/core/styles';
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from '@material-ui/core/Button';
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

class PlotLayerEncodingChannel extends React.Component {
  setPlotLayerEncodingChannelKey = (layerIndex, currentChannelKey) => e => {
    if (currentChannelKey === e.target.value) return;

    this.props.setPlotLayerEncodingChannelKey(layerIndex, currentChannelKey, e.target.value)
  };

  addPlotLayerEncodingChannelProperty = (layerIndex, channelKey, propertyKey, propertyValue) => e => {
    this.props.addPlotLayerEncodingChannelProperty(layerIndex, channelKey, propertyKey, propertyValue)
  };

  deletePlotLayerEncodingChannel = (layerIndex, channelKey) => e => {
    this.props.deletePlotLayerEncodingChannel(layerIndex, channelKey)
  };

  render() {
    const { classes, config, plot, layerIndex, channelKey, channelData, getMenuItems } = this.props;

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

    const channelDataParameters = [];
    const channelDataMap = new Map(Object.entries(channelData));

    let i = 0;
    for (let [k, v] of channelDataMap) {
      channelDataParameters.push(
        <PlotLayerEncodingChannelParameter
          key={i}
          layerIndex={layerIndex}
          channelKey={channelKey}
          propertyKey={k}
          propertyValue={v}
          getMenuItems={getMenuItems}
        />
      );

      i++;
    }

    return (
      <div className={classes.root}>
        <FormControl className={classes.formControl}>
          <Select
            onChange={this.setPlotLayerEncodingChannelKey(layerIndex, channelKey)}
            value={channelKey}
          >
            {encodingChannelMenuItems()}
          </Select>

          <Button
            variant="contained"
            className={classes.button}
            onClick={this.addPlotLayerEncodingChannelProperty(layerIndex, channelKey, "aggregate", "mean")}
          >
            Add encoding parameter
          </Button>
          <IconButton
            className={classes.button}
            aria-label="Delete encoding channel"
            color="primary"
            onClick={this.deletePlotLayerEncodingChannel(layerIndex, channelKey)}
          >
            <DeleteIcon />
          </IconButton>
          {channelDataParameters}
        </FormControl>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  config: state.config.config,
  plot: state.plot,
});

const mapDispatchToProps = (dispatch) => ({
  setPlotLayerEncodingChannelKey: (layerIndex, currentChannelKey, newChannelKey) => dispatch(setPlotLayerEncodingChannelKey(layerIndex, currentChannelKey, newChannelKey)),
  addPlotLayerEncodingChannelProperty: (layerIndex, channelKey, propertyKey, propertyValue) => dispatch(addPlotLayerEncodingChannelProperty(layerIndex, channelKey, propertyKey, propertyValue)),
  deletePlotLayerEncodingChannel: (layerIndex, channelKey) => dispatch(deletePlotLayerEncodingChannel(layerIndex, channelKey)),
});

PlotLayerEncodingChannel.propTypes = {
  classes: PropTypes.object.isRequired,
  layerIndex: PropTypes.number.isRequired,
  channelKey: PropTypes.string.isRequired,
  channelData: PropTypes.object.isRequired,
  getMenuItems: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired,
  plot: PropTypes.object.isRequired,
};

PlotLayerEncodingChannel = withStyles(styles)(PlotLayerEncodingChannel);
PlotLayerEncodingChannel = connect(mapStateToProps, mapDispatchToProps)(PlotLayerEncodingChannel);

export default PlotLayerEncodingChannel;
