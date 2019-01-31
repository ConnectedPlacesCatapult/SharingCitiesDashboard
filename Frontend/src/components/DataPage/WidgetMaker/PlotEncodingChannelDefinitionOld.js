import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from "@material-ui/core/TextField";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

// vega
import {
  VEGA_LITE_FIELDS,
} from "./../../../constants";

// misc utils
import classNames from "classnames";

class PlotEncodingChannelDefinition extends React.Component {
  constructor(props) {
    super(props);
  }

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
    const { classes, encoding, channel, field, value, expanded } = this.props;

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

    const valueMenuItems = this.props.getPermittedDefinitionFieldValues(field).map((val, i) => {
      return (
        <MenuItem
          key={i}
          value={val}
        >
          {val.toString()}
        </MenuItem>
      )
    });

    return (
      <ExpansionPanel
        expanded={expanded}
        onChange={this.props.handleDefinitionPanelClick(`panel${this.props.i}`)}
        className={classNames(classes.root, classes.expansionPanel)}
      >
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{field} :: {value}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div className={classes.flexInline}>
            <FormControl>
              <Select
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
                  value={value}
                  onChange={this.handleValueChange}
                >
                  {valueMenuItems}
                </Select>
              )}
            </FormControl>
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
            Delete Definition
            <DeleteIcon className={classNames(classes.rightIcon, classes.iconSmall)} />
          </Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    )
  }
}

PlotEncodingChannelDefinition.propTypes = {
  i: PropTypes.number.isRequired,
  classes: PropTypes.object.isRequired,
  encoding: PropTypes.object.isRequired,
  channel: PropTypes.string.isRequired,
  expanded: PropTypes.bool.isRequired,
  field: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  handleDefinitionPanelClick: PropTypes.func.isRequired,
  deleteDefinition: PropTypes.func.isRequired,
  updateDefinition: PropTypes.func.isRequired,
  getPermittedDefinitionFieldValues: PropTypes.func.isRequired,
};

export default PlotEncodingChannelDefinition
