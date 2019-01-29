import React from 'react';
import PropTypes from "prop-types";

import PlotEncodingChannel from './PlotEncodingChannel';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import FormGroup from "@material-ui/core/FormGroup";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Select from "@material-ui/core/Select";
import Divider from "@material-ui/core/Divider";

// redux
import { connect } from 'react-redux';
import {
  setPlotProperty,
  setPlotEncoding,
} from './../../../actions/editorActions';

// vega
import {
  VEGA_LITE_ENCODING_CHANNELS,
  VEGA_LITE_FIELDS,
  VEGA_LITE_MARKS,
} from "./../../../constants";

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: theme.spacing.unit * 20,
  },
  textField: {
    margin: theme.spacing.unit,
  },
  select: {
    //margin: theme.spacing.unit,
  },
  button: {
    margin: theme.spacing.unit,
  },
  spacer: {
    margin: `${theme.spacing.unit}px 0`,
  },
  inline: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  inputLabel: {

  },
  expansionPanelsWrapper: {
    margin: `${theme.spacing.unit * 2}px ${theme.spacing.unit}px ${theme.spacing.unit}px`,
  },
  expansionPanel: {
    //margin: theme.spacing.unit,
  },
  expansionPanelSummary: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  expansionPanelDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  expansionPanelHeader: {

  },
});

class PlotConfig extends React.Component {
  state = {
    expandedChannel: null,
  };

  getPermittedDefinitionFieldValues = (field) => {
    const currentFieldObject = VEGA_LITE_FIELDS.find((fieldObject) => fieldObject.name === field);

    let values = [];

    switch (currentFieldObject.type) {
      case "DataFieldName":
        values = this.props.data.data.length ? Object.keys(this.props.data.data[0]) : [];

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

    return values
  };

  handleChannelPanelClick = (panel) => (e, expandedChannel) => {
    this.setState({
      expandedChannel: expandedChannel ? panel : false,
    })
  };

  updateSpecProperty = (property) => (e) => {
    this.props.setPlotProperty(property, e.target.value)
  };

  addEncodingChannel = () => {
    const usedChannels = Object.keys(this.props.editor.plotConfig.spec.encoding);
    let freeChannel;

    for (let channel of VEGA_LITE_ENCODING_CHANNELS) {
      if (!usedChannels.includes(channel)) {
        freeChannel = channel;

        break;
      }
    }

    // ToDo :: catch here if no freeChannel

    // create new channel and populate it with all "required" channel field definitions
    const updatedEncoding = {...this.props.editor.plotConfig.spec.encoding};
    updatedEncoding[freeChannel] = {};

    const requiredFields = VEGA_LITE_FIELDS.filter((field) => field.required);

    for (let field of requiredFields) {
      updatedEncoding[freeChannel][field.name] = field.default
    }

    this.props.setPlotEncoding(updatedEncoding)
  };

  updateEncodingChannel = (oldChannel, newChannel) => {
    const updatedEncoding = {...this.props.editor.plotConfig.spec.encoding};
    updatedEncoding[newChannel] = updatedEncoding[oldChannel];

    delete updatedEncoding[oldChannel];

    this.props.setPlotEncoding(updatedEncoding)
  };

  deleteEncodingChannel = (channel) => {
    const updatedEncoding = {...this.props.editor.plotConfig.spec.encoding};

    delete updatedEncoding[channel];

    this.props.setPlotEncoding(updatedEncoding)
  };

  addDefinition = (channel) => {
    const usedDefinitions = Object.keys(this.props.editor.plotConfig.spec.encoding[channel]);
    let freeDefinition;

    for (let definition of VEGA_LITE_FIELDS) {
      if (!usedDefinitions.includes(definition.name)) {
        freeDefinition = definition;

        break;
      }
    }

    // ToDo :: catch here if no freeDefinition

    const updatedEncoding = {...this.props.editor.plotConfig.spec.encoding};
    updatedEncoding[channel][freeDefinition.name] = freeDefinition.default;

    this.props.setPlotEncoding(updatedEncoding)
  };

  updateDefinition = (channel, oldField, newField, value) => {
    const updatedEncoding = {...this.props.editor.plotConfig.spec.encoding};

    if (oldField === newField) {
      // only update value
      updatedEncoding[channel][oldField] = value;
    } else {
      // update field
      updatedEncoding[channel][newField] = updatedEncoding[channel][oldField];

      delete updatedEncoding[channel][oldField];

      // check if value is appropriate for new field
      const permittedValues = this.getPermittedDefinitionFieldValues(newField);

      // old value is invalid
      if (!permittedValues.includes(value)) {
        // replace old value with default for new field
        updatedEncoding[channel][newField] = VEGA_LITE_FIELDS.find((fieldObject) => fieldObject.name === newField)['default'];
      }
    }

    this.props.setPlotEncoding(updatedEncoding)
  };

  deleteDefinition = (channel, field) => {
    const updatedEncoding = {...this.props.editor.plotConfig.spec.encoding};

    delete updatedEncoding[channel][field];

    this.props.setPlotEncoding(updatedEncoding)
  };

  render() {
    const { classes, editor } = this.props;

    const markMenuItems = VEGA_LITE_MARKS.map((item, i) => {
      return (
        <MenuItem
          className={classes.menuItem}
          key={i}
          value={item}
        >
          {item}
        </MenuItem>
      )
    });

    const encodingChannelNodes = Object.keys(editor.plotConfig.spec.encoding).map((channel, i) => {
      return (
        <PlotEncodingChannel
          key={i}
          i={i}
          classes={classes}
          encoding={editor.plotConfig.spec.encoding}
          channel={channel}
          expanded={this.state.expandedChannel === `panel${i}`}
          handleChannelPanelClick={this.handleChannelPanelClick}
          deleteEncodingChannel={this.deleteEncodingChannel}
          updateEncodingChannel={this.updateEncodingChannel}
          addDefinition={this.addDefinition}
          deleteDefinition={this.deleteDefinition}
          updateDefinition={this.updateDefinition}
          getPermittedDefinitionFieldValues={this.getPermittedDefinitionFieldValues}
        />
      )
    });

    return (
      <FormGroup className={classes.root}>

        <Divider className={classes.spacer} />

        <FormLabel className={classes.formLabel}>Dimensions</FormLabel>

        <div className={classes.inline}>

          <FormControl htmlFor="plot-width" className={classes.formControl}>
            <TextField
              className={classes.textField}
              label="width"
              value={editor.plotConfig.spec.width}
              onChange={this.updateSpecProperty('width')}
              inputProps={{
                name: 'plotWidth',
                id: 'plot-width',
              }}
            />
          </FormControl>

          <FormControl htmlFor="plot-height" className={classes.formControl}>
            <TextField
              className={classes.textField}
              label="height"
              value={editor.plotConfig.spec.height}
              onChange={this.updateSpecProperty('height')}
              inputProps={{
                name: 'plotHeight',
                id: 'plot-height',
              }}
            />
          </FormControl>

        </div>

        <Divider className={classes.spacer} />

        <FormLabel className={classes.formLabel}>Mark</FormLabel>
        <FormControl htmlFor="plot-mark" className={classes.formControl}>
          <Select
            className={classes.select}
            label="mark"
            value={editor.plotConfig.spec.mark}
            onChange={this.updateSpecProperty('mark')}
            inputProps={{
              name: 'plotMark',
              id: 'plot-mark',
            }}
          >
            {markMenuItems}
          </Select>
        </FormControl>

        <Divider className={classes.spacer} />

        <FormLabel className={classes.formLabel}>Encoding Channels</FormLabel>

        <div className={classes.expansionPanelsWrapper}>
          {encodingChannelNodes}
        </div>

        <IconButton
          className={classes.button}
          variant="contained"
          color="secondary"
          onClick={this.addEncodingChannel}
        >
          <AddIcon fontSize="small" />
        </IconButton>

      </FormGroup>
    )
  }
}

PlotConfig.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
  editor: state.editor,
});

const mapDispatchToProps = (dispatch) => ({
  setPlotProperty: (property, value) => dispatch(setPlotProperty(property, value)),
  setPlotEncoding: (encoding) => dispatch(setPlotEncoding(encoding)),
});

PlotConfig = withStyles(styles)(PlotConfig);
PlotConfig = connect(mapStateToProps, mapDispatchToProps)(PlotConfig);

export default PlotConfig
