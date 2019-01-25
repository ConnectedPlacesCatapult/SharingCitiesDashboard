import React from 'react';
import PropTypes from 'prop-types';

// redux
import { connect } from 'react-redux';
import {

} from './../../actions/vegaLiteActions';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import Typography from "@material-ui/core/Typography";
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from "@material-ui/core/ListItem";
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

// vega
import VegaLite from 'react-vega-lite';
import {
  VEGA_LITE_AGGREGATE_OPERATIONS,
  VEGA_LITE_DATA_TYPES,
  VEGA_LITE_ENCODING_CHANNELS,
  VEGA_LITE_FIELDS,
  VEGA_LITE_MARKS,
  VEGA_LITE_TIME_UNITS,
} from "../../constants";

const styles = theme => ({
  root: {
    margin: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column',
  },
  plotForm: {

  },
  form: {

  },
  formControl: {

  },
  textField: {

  },
  select: {

  },
  menuItem: {

  },
  button: {

  },
  encodingWrapper: {
    display: 'flex',
    flexDirection: 'row',
  },
  channelWrapper: {
    border: '1px solid #000',
    margin: theme.spacing.unit,
    padding: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column',
  },
  definitionWrapper: {
    border: '1px solid #000',
    margin: theme.spacing.unit,
    padding: theme.spacing.unit,
  },
  plotWrapper: {
    display: 'flex',
    flexDirection: 'row',
  },
  spec: {
    border: '1px solid black',
  },
  plot: {

  },
});

class VegaLitePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      spec: props.vegaLite.spec,
      data: props.vegaLite.data
    }
  }

  updateSpecProperty = (property) => (e) => {
    const spec = {
      ...this.state.spec,
      [property]: e.target.value,
    };

    this.setState({ spec })
  };

  addEncodingChannel = () => {
    const usedChannels = Object.keys(this.state.spec.encoding);
    let freeChannel;

    for (let channel of VEGA_LITE_ENCODING_CHANNELS) {
      if (!usedChannels.includes(channel)) {
        freeChannel = channel;

        break;
      }
    }

    // ToDo :: catch here if no freeChannel

    // create new channel and populate it with all "required" channel field definitions
    const updatedEncoding = {...this.state.spec.encoding};
    updatedEncoding[freeChannel] = {};

    const requiredFields = VEGA_LITE_FIELDS.filter((field) => field.required);

    for (let field of requiredFields) {
      updatedEncoding[freeChannel][field.name] = field.default
    }

    const spec = {
      ...this.state.spec,
      encoding: updatedEncoding,
    };

    this.setState({ spec })
  };

  addEncodingChannelDefinition = (channel) => {
    // ToDo :: FIX THIS!

    console.log(channel, this.state.spec.encoding[channel]);

    const usedDefinitions = Object.keys(this.state.spec.encoding[channel]);
    let freeDefinition;

    for (let definition of VEGA_LITE_FIELDS) {
      if (!usedDefinitions.includes(definition.name)) {
        freeDefinition = definition;

        break;
      }
    }

    // ToDo :: catch here if no freeDefinition

    const updatedEncoding = {...this.state.spec.encoding};
    updatedEncoding[channel][freeDefinition.name] = freeDefinition.default;

    const spec = {
      ...this.state.spec,
      encoding: updatedEncoding,
    };

    this.setState({ spec })
  };

  deleteEncodingChannel = (channel) => {
    const updatedEncoding = {...this.state.spec.encoding};

    delete updatedEncoding[channel];

    const spec = {
      ...this.state.spec,
      encoding: updatedEncoding,
    };

    this.setState({ spec })
  };

  deleteEncodingChannelDefinition = (channel, field) => {
    const updatedEncoding = {...this.state.spec.encoding};

    delete updatedEncoding[channel][field];

    const spec = {
      ...this.state.spec,
      encoding: updatedEncoding,
    };

    this.setState({ spec })
  };

  updateEncodingChannel = (oldChannel) => (e) => {
    const updatedEncoding = {...this.state.spec.encoding};
    updatedEncoding[e.target.value] = updatedEncoding[oldChannel];

    delete updatedEncoding[oldChannel];

    const spec = {
      ...this.state.spec,
      encoding: updatedEncoding,
    };

    this.setState({ spec })
  };

  updateEncodingChannelField = (channel, oldField) => e => {
    const updatedEncoding = {...this.state.spec.encoding};
    updatedEncoding[channel][e.target.value] = updatedEncoding[channel][oldField];

    delete updatedEncoding[channel][oldField];

    const spec = {
      ...this.state.spec,
      encoding: updatedEncoding,
    };

    this.setState({ spec })
  };

  updateEncodingChannelValue = (channel, field) => e => {
    const updatedEncoding = {...this.state.spec.encoding};
    updatedEncoding[channel][field] = e.target.value;

    const spec = {
      ...this.state.spec,
      encoding: updatedEncoding,
    };

    this.setState({ spec })
  };

  markMenuItems = VEGA_LITE_MARKS.map((item, i) => {
    return (
      <MenuItem
        className={this.props.classes.menuItem}
        key={i}
        value={item}
      >
        {item}
      </MenuItem>
    )
  });

  getEncodingChannelMenuItems = (currentChannel) => {
    const usedChannels = Object.keys(this.state.spec.encoding);

    return (
      VEGA_LITE_ENCODING_CHANNELS.map((item, i) => {
        return (
          <MenuItem
            className={this.props.classes.menuItem}
            key={i}
            value={item}
            disabled={(item !== currentChannel) && usedChannels.includes(item)}
          >
            {item}
          </MenuItem>
        )
      })
    )
  };

  getEncodingChannelFieldMenuItems = (currentChannel, currentField) => {
    const usedFields = Object.keys(this.state.spec.encoding[currentChannel]);

    return VEGA_LITE_FIELDS.map((field, i) => {
      return (
        <MenuItem
          className={this.props.classes.menuItem}
          key={i}
          value={field.name}
          disabled={(field.name !== currentField) && usedFields.includes(field.name)}
        >
          {field.name}
        </MenuItem>
      )
    })
  };

  getEncodingChannelValueMenuItems = (currentChannel, currentField) => {
    const currentFieldObject = VEGA_LITE_FIELDS.find((field) => field.name === currentField);

    let values = [];

    switch (currentFieldObject.type) {
      case "DataFieldName":
        values = this.state.data.values.length ? Object.keys(this.state.data.values[0]) : [];

        break;

      // ToDo :: needs to handle "title" field types
      case String:
        values = [];

        break;

      case Boolean:

        values = [true, false];

        break;

      default:
        values = currentFieldObject.type;

        break;
    }

    return values.map((value, i) => {
      return (
        <MenuItem
          className={this.props.classes.menuItem}
          key={i}
          value={value}
        >
          {value.toString()}
        </MenuItem>
      )
    })
  };

  getEncodingChannels = () => {
    const { classes } = this.props;
    const { spec } = this.state;

    let channelNodes = [];

    for (let [i, channel] of Object.keys(spec.encoding).entries()) {

      const channelData = Object.entries(spec.encoding[channel]);

      const channelDefinitions = channelData.map((pair, i) => {
        let field = pair[0];
        let value = pair[1];

        return (
          <div key={i} className={classes.definitionWrapper}>
            <IconButton
              className={classes.button}
              onClick={() => this.deleteEncodingChannelDefinition(channel, field)}
            >
              <DeleteIcon />
            </IconButton>
            <FormControl className={classes.formControl}>
              <Select
                value={field}
                onChange={this.updateEncodingChannelField(channel, field)}
              >
                {this.getEncodingChannelFieldMenuItems(channel, field)}
              </Select>
            </FormControl>

            <FormControl className={classes.formControl}>
              <Select
                value={value}
                onChange={this.updateEncodingChannelValue(channel, field)}
              >
                {this.getEncodingChannelValueMenuItems(channel, field)}
              </Select>
            </FormControl>
          </div>
        )
      });

      let node = (
        <div className={classes.channelWrapper} key={i}>
          <InputLabel className={classes.inputLabel}>Channel</InputLabel>
          <Button
            className={classes.button}
            onClick={() => this.deleteEncodingChannel(channel)}
          >
            Delete channel
          </Button>
          <FormControl className={classes.formControl}>
            <Select
              value={channel}
              onChange={this.updateEncodingChannel(channel)}
            >
              {this.getEncodingChannelMenuItems(channel)}
            </Select>
          </FormControl>
          {channelDefinitions}
          <Button
            className={classes.button}
            onClick={() => this.addEncodingChannelDefinition(channel)}
          >
            Add definition
          </Button>
        </div>
      );

      channelNodes = [...channelNodes, node]
    }

    return channelNodes
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.plotForm}>
          <form className={classes.form}>
            <FormControl className={classes.formControl}>
              <FormLabel className={classes.formLabel}>Details</FormLabel>
              <TextField
                className={classes.textField}
                label="title"
                value={this.state.spec.title}
                onChange={this.updateSpecProperty('title')}
              />
              <TextField
                className={classes.textField}
                label="width"
                value={this.state.spec.width}
                onChange={this.updateSpecProperty('width')}
              />
              <TextField
                className={classes.textField}
                label="height"
                value={this.state.spec.height}
                onChange={this.updateSpecProperty('height')}
              />
            </FormControl>
            <FormControl className={classes.formControl}>
              <FormLabel className={classes.formLabel}>Mark</FormLabel>
              <Select
                className={classes.select}
                label="mark"
                value={this.state.spec.mark}
                onChange={this.updateSpecProperty('mark')}
              >
                {this.markMenuItems}
              </Select>
            </FormControl>
            <div className={classes.encodingWrapper}>
              <FormLabel className={classes.formLabel}>Encoding</FormLabel>
              {this.getEncodingChannels()}
              <Button
                onClick={this.addEncodingChannel}
              >
                Add channel
              </Button>
            </div>
          </form>
        </div>
        <div className={classes.plotWrapper}>
          <pre className={classes.spec}>
            {JSON.stringify(this.state.spec, undefined, 2)}
          </pre>
          <VegaLite
            className={classes.plot}
            spec={this.state.spec}
            data={this.state.data}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  vegaLite: state.vegaLite,
});

const mapDispatchToProps = (dispatch) => ({

});

VegaLitePage.propTypes = {
  classes: PropTypes.object.isRequired,
};

VegaLitePage = withStyles(styles)(VegaLitePage);
VegaLitePage = connect(mapStateToProps, mapDispatchToProps)(VegaLitePage);

export default VegaLitePage
