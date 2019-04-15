import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  Button,
  Checkbox,
  Divider,
  ExpansionPanel,
  ExpansionPanelActions,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  FormControl,
  FormGroup,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
  withStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import DeleteIcon from '@material-ui/icons/Delete';
import { connect } from 'react-redux';
import { setWidgetConfigProperty } from './../../../actions/editorActions';
import {
  VEGA_LITE_ENCODING_CHANNELS,
  VEGA_LITE_FIELDS,
  VEGA_LITE_MARKS,
} from './../../../constants';

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  spacer: {
    margin: `${theme.spacing.unit}px 0`,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
  flexColumn: {
    flexDirection: 'column',
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexInline: {
    display: "inline-flex",
  },
  expansionPanel: {
    margin: 0,

    '&$expanded': {
      borderBottomColor: '#00ff00',
    }
  },
  expansionPanelSummary: {
    // ToDo :: try remove top and bottom margin (20px) from the child element when "expanded"
    padding: `0 ${theme.spacing.unit * 2}px`,
    '&$expanded': {
      minHeight: '48px',
    },
  },
  expanded: {},
  channelDefinition: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  channelDefinitionSelect: {
    minWidth: theme.spacing.unit * 16,
    marginRight: theme.spacing.unit,
  },
  grow: {
    flexGrow: 1,
  },
  actionButton: {
    boxShadow: 'none'
  }
});

class PlotConfig extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    editor: PropTypes.object.isRequired,
    setWidgetConfigProperty: PropTypes.func.isRequired,
  };

  state = {
    expandedChannel: null,
  };

  getPermittedDefinitionFieldValues = (field) => {
    const { editor } = this.props;

    const currentFieldObject = VEGA_LITE_FIELDS.find((fieldObject) => fieldObject.name === field);

    let values = [];

    switch (currentFieldObject.type) {
      case "DataFieldName":
        values = editor.widget.config.data.values.length ? Object.keys(editor.widget.config.data.values[0]) : [];

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

  setPlotProperty = (property) => (e) => {
    this.props.setWidgetConfigProperty(property, e.target.value)
  };

  setPlotSpecProperty = (property) => (e) => {
    const { editor, setWidgetConfigProperty } = this.props;

    setWidgetConfigProperty('spec', {
      ...editor.widget.config.spec,
      [property]: e.target.value,
    })
  };

  setPlotEncoding = (updatedEncoding) => {
    const { editor, setWidgetConfigProperty } = this.props;

    setWidgetConfigProperty('spec', {
      ...editor.widget.config.spec,
      encoding: {
        ...updatedEncoding,
      },
    })
  };

  addEncodingChannel = () => {
    const { editor } = this.props;

    const usedChannels = Object.keys(editor.widget.config.spec.encoding);
    let freeChannel;

    for (let channel of VEGA_LITE_ENCODING_CHANNELS) {
      if (!usedChannels.includes(channel)) {
        freeChannel = channel;

        break;
      }
    }

    // ToDo :: catch here if no freeChannel

    // create new channel and populate it with all "required" channel field definitions
    const updatedEncoding = {...editor.widget.config.spec.encoding};
    updatedEncoding[freeChannel] = {};

    const requiredFields = VEGA_LITE_FIELDS.filter((field) => field.required);

    for (let field of requiredFields) {
      updatedEncoding[freeChannel][field.name] = field.default
    }

    this.setPlotEncoding(updatedEncoding)
  };

  updateEncodingChannel = (oldChannel, newChannel) => {
    const { editor } = this.props;

    if (oldChannel === newChannel) return;

    const updatedEncoding = {...editor.widget.config.spec.encoding};
    updatedEncoding[newChannel] = updatedEncoding[oldChannel];

    delete updatedEncoding[oldChannel];

    this.setPlotEncoding(updatedEncoding)
  };

  deleteEncodingChannel = (channel) => {
    const { editor } = this.props;

    const updatedEncoding = {...editor.widget.config.spec.encoding};

    delete updatedEncoding[channel];

    this.setPlotEncoding(updatedEncoding)
  };

  addDefinition = (channel) => {
    const { editor } = this.props;

    const usedDefinitions = Object.keys(editor.widget.config.spec.encoding[channel]);

    let freeDefinition;

    for (let definition of VEGA_LITE_FIELDS) {
      if (!usedDefinitions.includes(definition.name)) {
        freeDefinition = definition;

        break;
      }
    }

    // ToDo :: catch here if no freeDefinition

    const updatedEncoding = {...editor.widget.config.spec.encoding};
    updatedEncoding[channel][freeDefinition.name] = freeDefinition.default;

    this.setPlotEncoding(updatedEncoding)
  };

  updateDefinition = (channel, oldField, newField, value) => {
    const { editor } = this.props;

    const updatedEncoding = {...editor.widget.config.spec.encoding};

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

    this.setPlotEncoding(updatedEncoding)
  };

  deleteDefinition = (channel, field) => {
    const { editor } = this.props;

    const updatedEncoding = {...editor.widget.config.spec.encoding};

    delete updatedEncoding[channel][field];

    this.setPlotEncoding(updatedEncoding)
  };

  render() {
    const { classes, editor } = this.props;

    const markMenuItems = VEGA_LITE_MARKS.map((item, i) => <MenuItem key={i} value={item}>{item}</MenuItem>);

    const encodingChannelNodes = Object.keys(editor.widget.config.spec.encoding).map((channel, i) => {
      return (
        <EncodingChannel
          key={i}
          i={i}
          classes={classes}
          encoding={editor.widget.config.spec.encoding}
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
        <FormLabel>Mark</FormLabel>
        <FormControl htmlFor="plot-mark">
          <Select
            label="mark"
            value={editor.widget.config.spec.mark}
            onChange={this.setPlotSpecProperty('mark')}
            inputProps={{
              name: 'plotMark',
              id: 'plot-mark',
            }}
          >
            {markMenuItems}
          </Select>
        </FormControl>
        <Divider className={classes.spacer} />
        <FormLabel>Encoding Channels</FormLabel>
        <br />
        {encodingChannelNodes}
        <br />
        <div>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={this.addEncodingChannel}
            className={classes.actionButton}
          >
            Add Channel
            <AddIcon className={classNames(classes.rightIcon, classes.iconSmall)} />
          </Button>
        </div>
      </FormGroup>
    )
  }
}

const mapStateToProps = (state) => ({
  editor: state.editor,
});

const mapDispatchToProps = (dispatch) => ({
  setWidgetConfigProperty: (property, value) => dispatch(setWidgetConfigProperty(property, value)),
});

PlotConfig = withStyles(styles)(PlotConfig);
PlotConfig = connect(mapStateToProps, mapDispatchToProps)(PlotConfig);

export default PlotConfig;

class EncodingChannel extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

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
        <EncodingChannelDefinition
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

class EncodingChannelDefinition extends React.Component {
  handleDeleteClick = () => {
    this.props.deleteDefinition(this.props.channel, this.props.field)
  };

  handleFieldChange = (e) => {
    this.props.updateDefinition(this.props.channel, this.props.field, e.target.value, this.props.value)
  };

  handleValueChange = (e) => {
    this.props.updateDefinition(this.props.channel, this.props.field, this.props.field, e.target.value)
  };

  render() {
    const { classes, encoding, channel, field, value } = this.props;

    const fieldMenuItems = VEGA_LITE_FIELDS.map((fieldObject, i) => {
      return (
        <MenuItem
          key={i}
          value={fieldObject.name}
          disabled={(fieldObject.name !== field) && Object.keys(encoding[channel]).includes(fieldObject.name)}
        >
          {fieldObject.name.toString()}
        </MenuItem>
      )
    });

    const valueMenuItems = this.props.getPermittedDefinitionFieldValues(field).map((val, i) => <MenuItem key={i} value={val}>{val.toString()}</MenuItem>);

    return (
      <div className={classes.channelDefinition}>
        <FormControl>
          <Select
            className={classes.channelDefinitionSelect}
            value={field}
            onChange={this.handleFieldChange}
          >
            {fieldMenuItems}
          </Select>
        </FormControl>
        <FormControl>
          {field === "title" ? (
            <TextField
              placeholder="title"
              value={value}
              onChange={this.handleValueChange}
            />
          ) : (
            <Select
              className={classes.channelDefinitionSelect}
              value={value}
              onChange={this.handleValueChange}
            >
              {valueMenuItems}
            </Select>
          )}
        </FormControl>
        <span className={classes.grow} />
        <IconButton
          color="secondary"
          onClick={this.handleDeleteClick}
        >
          <DeleteIcon className={classes.iconSmall} />
        </IconButton>
      </div>
    )
  }
}
