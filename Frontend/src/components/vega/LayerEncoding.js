import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import {
  addLayerEncodingChannel,
  removeLayerEncodingChannel,
} from "../../actions/vegaActions";

import LayerEncodingChannel from "./LayerEncodingChannel";

import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";

const styles = theme => ({
  root: {

  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: theme.spacing.unit * 20,
  },
  formLabel: {

  },
});

class LayerEncoding extends React.Component {
  render() {
    const { classes, layerIndex, vega } = this.props;

    const encodingChannels = [];

    const test = () => {
      let lec = [];
      // let layerChannels = Object.entries(vega.layer[layerIndex].encoding);
      //
      // console.log(layerChannels);

      // this layer's encoding channels
      let channels = Object.entries(vega.layer[layerIndex].encoding).sort((a, b) => a[0] - b[0]);
      let i = 0;

      //

      console.log(channels);

      // sorted
      //channels.sort((a, b) => a[0] - b[0]);
      //console.log(channels);

      // Object.entries(obj).sort((a, b) => a[0] - b[0]);.

      for (const [key, value] of channels) {
        //console.log(`${key} ${value}`, layerIndex); // "a 5", "b 7", "c 9"
        lec =  [...lec, <LayerEncodingChannel key={i} layerIndex={layerIndex} channelIndex={i} />];
        i++;
      }

      //console.log(lec)

      return lec;
    };

    test();

    return (
      <FormControl htmlFor="plot-layer-encoding" className={classes.formControl}>
        <FormLabel className={classes.formLabel}>Encoding</FormLabel>
        {test()}
        {/*<LayerEncodingChannel layerIndex={layerIndex} channelIndex={0} />*/}
      </FormControl>
    )
  }
}

const mapStateToProps = state => ({
  vega: state.vega,
});

const mapDispatchToProps = dispatch => ({
  addLayerEncodingChannel: (layerIndex) => dispatch(layerIndex),
  removeLayerEncodingChannel: (layerIndex, channelIndex) => dispatch(layerIndex, channelIndex),
});

LayerEncoding.propTypes = {
  classes: PropTypes.object.isRequired,
  layerIndex: PropTypes.number.isRequired,
  vega: PropTypes.object.isRequired,
};

LayerEncoding = withStyles(styles)(LayerEncoding);

export default connect(mapStateToProps, mapDispatchToProps)(LayerEncoding)
