import React from 'react';
import PropTypes from 'prop-types';

import PlotEncodingChannelDefinition from './PlotEncodingChannelDefinition';

// material-ui
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import Select from "@material-ui/core/Select";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Typography from '@material-ui/core/Typography';
import Divider from "@material-ui/core/Divider";

// vega
import {
  VEGA_LITE_ENCODING_CHANNELS,
} from "./../../../constants";

// misc utils
import classNames from 'classnames';

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

    const channelMenuItems = VEGA_LITE_ENCODING_CHANNELS.map((item, i) => {
      return (
        <MenuItem
          key={i}
          value={item}
          disabled={(item !== channel) && Object.keys(encoding).includes(item)}
        >
          {item.toString()}
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
        <ExpansionPanelSummary className={classNames(classes.expansionPanelSummary, classes.expanded)} expandIcon={<ArrowDropDownIcon />}>
          <Typography>{channel}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.flexColumn}>
          <FormLabel>Channel</FormLabel>
          <FormControl>
            <Select
              value={channel}
              onChange={this.handleChannelChange}
            >
              {channelMenuItems}
            </Select>
          </FormControl>
          <br />
          <FormLabel>Definitions</FormLabel>
          {definitionNodes}
          <br />
          <div>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={this.handleAddDefinitionClick}
            >
              Add Definition
              <AddIcon className={classNames(classes.rightIcon, classes.iconSmall)} />
            </Button>
          </div>
        </ExpansionPanelDetails>
        <Divider className={classes.spacer} />
        <ExpansionPanelActions>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={this.handleDeleteClick}
          >
            Delete Channel
            <DeleteIcon className={classNames(classes.rightIcon, classes.iconSmall)} />
          </Button>
        </ExpansionPanelActions>
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
