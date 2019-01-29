import React from 'react';
import PropTypes from 'prop-types';

import PlotEncodingChannelDefinition from './PlotEncodingChannelDefinition';

// material-ui
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import Select from "@material-ui/core/Select";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';

// vega
import {
  VEGA_LITE_ENCODING_CHANNELS,
} from "./../../../constants";

// misc utils
import classNames from 'classnames';
import FormLabel from "@material-ui/core/FormLabel";

class PlotEncodingChannel extends React.Component {
  state = {
    expandedDefinition: null,
  };

  handleDefinitionPanelClick = (panel) => (e, expandedDefinition) => {
    this.setState({
      expandedDefinition: expandedDefinition ? panel : false,
    })
  };

  handleDeleteClick = () => {
    this.props.deleteEncodingChannel(this.props.channel)
  };

  handleChannelChange = (e) => {
    this.props.updateEncodingChannel(this.props.channel, e.target.value)
  };

  handleAddDefinitionClick = () => {
    this.props.addDefinition(this.props.channel)
  };

  render() {
    const { classes, encoding, channel, expanded } = this.props;

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
          i={i}
          classes={classes}
          encoding={encoding}
          channel={channel}
          expanded={this.state.expandedDefinition === `panel${i}`}
          handleDefinitionPanelClick={this.handleDefinitionPanelClick}
          field={definition[0]}
          value={definition[1]}
          deleteDefinition={this.props.deleteDefinition}
          updateDefinition={this.props.updateDefinition}
          getPermittedDefinitionFieldValues={this.props.getPermittedDefinitionFieldValues}
        />
      )
    });

    return (
      <ExpansionPanel
        expanded={expanded}
        onChange={this.props.handleChannelPanelClick(`panel${this.props.i}`)}
        className={classNames(classes.root, classes.expansionPanel)}
      >
        <ExpansionPanelSummary
          className={classes.expansionPanelSummary}
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography className={classes.expansionPanelHeader}>{channel}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.expansionPanelDetails}>
          <FormControl className={classes.formControl}>
            <Select
              className={classes.select}
              value={channel}
              onChange={this.handleChannelChange}
            >
              {channelMenuItems}
            </Select>
          </FormControl>

          <FormLabel className={classes.formLabel}>Definitions</FormLabel>

          <div className={classes.expansionPanelsWrapper}>
            {definitionNodes}
          </div>

          <IconButton
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={this.handleAddDefinitionClick}
          >
            <AddIcon fontSize="small" />
          </IconButton>

          <IconButton
            className={classes.button}
            variant="contained"
            color="secondary"
            onClick={this.handleDeleteClick}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>

        </ExpansionPanelDetails>
      </ExpansionPanel>
    )
  }
}

PlotEncodingChannel.propTypes = {
  i: PropTypes.number.isRequired,
  classes: PropTypes.object.isRequired,
  encoding: PropTypes.object.isRequired,
  channel: PropTypes.string.isRequired,
  expanded: PropTypes.bool.isRequired,
  handleChannelPanelClick: PropTypes.func.isRequired,
  deleteEncodingChannel: PropTypes.func.isRequired,
  updateEncodingChannel: PropTypes.func.isRequired,
  addDefinition: PropTypes.func.isRequired,
  deleteDefinition: PropTypes.func.isRequired,
  updateDefinition: PropTypes.func.isRequired,
  getPermittedDefinitionFieldValues: PropTypes.func.isRequired,
};

export default PlotEncodingChannel
