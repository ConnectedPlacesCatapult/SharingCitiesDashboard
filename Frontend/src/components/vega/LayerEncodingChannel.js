import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { connect } from 'react-redux';
import {
  setLayerEncodingChannel,
} from "../../actions/vegaActions";

import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";

const styles = theme => ({
  root: {

  },
  formControl: {

  },
  inputLabel: {

  },
});

const fieldValues = [

];

const typeValues = [

];

class LayerEncodingChannel extends React.Component {
  setLayerEncodingChannel = e => {
    this.props.setLayerEncodingChannel(this.props.layerIndex, this.props.channelIndex, e.target.value)
  };

  render() {
    const { classes, layerIndex, channelIndex, config, vega } = this.props;

    const channelItems = config.vegaEncodingChannels.map((channel, i) => {
      //console.log(layerIndex, channelIndex);

      return <MenuItem key={i} value={channel}>{channel}</MenuItem>
    });
    const fieldItems = [];
    const typeItems = [];

    return (
      <FormControl htmlFor="plot-layer-encoding" className={classes.formControl}>
        <InputLabel className={classes.inputLabel}>Channel</InputLabel>
        <Select
          value={"x"}
          onChange={this.setLayerEncodingChannel}
        >
          {channelItems}
        </Select>

        {/*<InputLabel className={classes.inputLabel}>Field</InputLabel>
        <Select
          value={"Timestamp"}
        >
          <MenuItem key={0} value={"Timestamp"}>{"Timestamp"}</MenuItem>
          <MenuItem key={1} value={"Value"}>{"Value"}</MenuItem>
        </Select>*/}

        {/*<InputLabel className={classes.inputLabel}>Type</InputLabel>
        <Select
          value={"quantitative"}
        >
          <MenuItem key={0} value={"quantitative"}>{"quantitative"}</MenuItem>
          <MenuItem key={1} value={"temporal"}>{"temporal"}</MenuItem>
        </Select>*/}

      </FormControl>
    )
  }
}

const mapStateToProps = state => ({
  config: state.config.config,
  vega: state.vega,
});

const mapDispatchToProps = dispatch => ({
  setLayerEncodingChannel: (layerIndex, channelIndex, channel) => dispatch(setLayerEncodingChannel(layerIndex, channelIndex, channel)),
});

LayerEncodingChannel.propTypes = {
  classes: PropTypes.object.isRequired,
  layerIndex: PropTypes.number.isRequired,
  channelIndex: PropTypes.number.isRequired,
  config: PropTypes.object.isRequired,
  vega: PropTypes.object.isRequired,
  setLayerEncodingChannel: PropTypes.func.isRequired,
};

LayerEncodingChannel = withStyles(styles)(LayerEncodingChannel);

export default connect(mapStateToProps, mapDispatchToProps)(LayerEncodingChannel)
