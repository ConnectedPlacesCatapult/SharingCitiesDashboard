import React from 'react';
import PropTypes from 'prop-types';

import PlotLayerEncodingChannel from './PlotLayerEncodingChannel';

// redux
import { connect } from 'react-redux';
import {
  addPlotLayerEncodingChannel,
} from "../../actions/plotActions";

// material-ui
import { withStyles } from '@material-ui/core/styles';
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Button from '@material-ui/core/Button';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing.unit * 2,
    //backgroundColor: theme.palette.primary.dark,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  button: {
    margin: theme.spacing.unit,
  },
  layers: {
    display: 'flex',
    flexDirection: 'column',
  },
});

class PlotLayerEncoding extends React.Component {
  addPlotLayerEncodingChannel = (layerIndex, channelKey) => e => {
    this.props.addPlotLayerEncodingChannel(layerIndex, channelKey)
  };

  setPlotLayerMark = (layerIndex) => e => {
    this.props.setPlotLayerMark(layerIndex, e.target.value)
  };

  render() {
    const { classes, config, plot, layerIndex, encoding, getMenuItems } = this.props;

    const channelMap = new Map(Object.entries(encoding));

    const encodingChannels = [];
    let i = 0;
    for (let [k, v] of channelMap) {
      encodingChannels.push(<PlotLayerEncodingChannel
        key={i}
        layerIndex={layerIndex}
        channelIndex={i}
        channelKey={k}
        channelData={v}
        getMenuItems={getMenuItems}
      />);

      i++;
    }

    const addEncodingChannelButton = () => {
      const availableChannels = config.vega.encodingChannels.filter((i) => !Object.keys(plot.spec.layer[layerIndex].encoding).includes(i));

      //console.log(availableChannels);

      // existing.includes(item) && current !== item

      // ToDo :: get this to check for a free encodingChannel and maybe even toggle disabled state on the "Add encoding channel" button

      return (
        <Button
          variant="contained"
          className={classes.button}
          disabled={!availableChannels.length}
          onClick={this.addPlotLayerEncodingChannel(layerIndex, availableChannels[0])}
        >
          Add encoding channel
        </Button>
      )
    };

    return (
      <div className={classes.root}>
        <FormControl key={layerIndex} htmlFor={`plot-layer-${layerIndex}-encoding`} className={classes.formControl}>
          <FormLabel className={classes.inputLabel}>Encoding</FormLabel>
          {/*<Button
            variant="contained"
            className={classes.button}
            onClick={this.addPlotLayerEncodingChannel}
          >
            Add encoding channel
          </Button>*/}
          {addEncodingChannelButton()}
          <div className={classes.layers}>
            {encodingChannels}
          </div>
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
  addPlotLayerEncodingChannel: (layerIndex, channelKey) => dispatch(addPlotLayerEncodingChannel(layerIndex, channelKey)),
});

PlotLayerEncoding.propTypes = {
  classes: PropTypes.object.isRequired,
  layerIndex: PropTypes.number.isRequired,
  encoding: PropTypes.object.isRequired,
  getMenuItems: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired,
  plot: PropTypes.object.isRequired,
  addPlotLayerEncodingChannel: PropTypes.func.isRequired,
};

PlotLayerEncoding = withStyles(styles)(PlotLayerEncoding);
PlotLayerEncoding = connect(mapStateToProps, mapDispatchToProps)(PlotLayerEncoding);

export default PlotLayerEncoding
