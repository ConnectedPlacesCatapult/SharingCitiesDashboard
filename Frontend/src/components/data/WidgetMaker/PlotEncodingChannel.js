import React from 'react';
import PropTypes from 'prop-types';

import PlotEncodingChannelDefinition from './PlotEncodingChannelDefinition';

// material-ui
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Button from '@material-ui/core/Button';
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";

// vega
import {
  VEGA_LITE_ENCODING_CHANNELS,
} from "./../../../constants";

class PlotEncodingChannel extends React.Component {
  handleDeleteClick = () => {
    this.props.deleteEncodingChannel(this.props.channel)
  };

  handleChannelChange = () => (e) => {
    this.props.updateEncodingChannel(this.props.channel, e.target.value)
  };

  handleAddDefinitionClick = () => {
    this.props.addDefinition(this.props.channel)
  };

  render() {
    const { classes, encoding, channel } = this.props;

    const channelMenuItems = VEGA_LITE_ENCODING_CHANNELS.map((channel, i) => {
      return (
        <MenuItem
          className={classes.menuItem}
          key={i}
          value={channel}
          disabled={(channel !== channel) && Object.keys(encoding).includes(channel)}
        >
          {channel.toString()}
        </MenuItem>
      )
    });

    const definitionNodes = Object.entries(encoding[channel]).map((definition, i) => {
      return (
        <PlotEncodingChannelDefinition
          key={i}
          classes={classes}
          encoding={encoding}
          channel={channel}
          field={definition[0]}
          value={definition[1]}
          deleteDefinition={this.props.deleteDefinition}
          updateDefinition={this.props.updateDefinition}
          getPermittedDefinitionFieldValues={this.props.getPermittedDefinitionFieldValues}
        />
      )
    });

    return (
      <div className={classes.channelWrapper}>
        <InputLabel className={classes.inputLabel}>Channel</InputLabel>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={this.handleDeleteClick}
        >
          Delete channel
        </Button>
        <FormControl className={classes.formControl}>
          <Select
            className={classes.select}
            value={channel}
            onChange={this.handleChannelChange}
          >
            {channelMenuItems}
          </Select>
        </FormControl>
        {definitionNodes}
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={this.handleAddDefinitionClick}
        >
          Add definition
        </Button>
      </div>
    )
  }
}

PlotEncodingChannel.propTypes = {
  classes: PropTypes.object.isRequired,
  encoding: PropTypes.object.isRequired,
  channel: PropTypes.string.isRequired,
  deleteEncodingChannel: PropTypes.func.isRequired,
  updateEncodingChannel: PropTypes.func.isRequired,
  addDefinition: PropTypes.func.isRequired,
  deleteDefinition: PropTypes.func.isRequired,
  updateDefinition: PropTypes.func.isRequired,
  getPermittedDefinitionFieldValues: PropTypes.func.isRequired,
};

export default PlotEncodingChannel
