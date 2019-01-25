import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

// vega
import {
  VEGA_LITE_FIELDS,
} from "../../constants";

class Definition extends React.Component {
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
    const { classes, encoding, channel, field, value } = this.props;

    const fieldMenuItems = VEGA_LITE_FIELDS.map((fieldObject, i) => {
      return (
        <MenuItem
          className={classes.menuItem}
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
          className={classes.menuItem}
          key={i}
          value={val}
        >
          {val.toString()}
        </MenuItem>
      )
    });

    return (
      <div className={classes.definitionWrapper}>
        <IconButton
          className={classes.button}
          color="secondary"
          onClick={this.handleDeleteClick}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
        <FormControl className={classes.formControl}>
          <Select
            value={field}
            onChange={this.handleFieldChange}
          >
            {fieldMenuItems}
          </Select>
        </FormControl>

        <FormControl className={classes.formControl}>
          <Select
            value={value}
            onChange={this.handleValueChange}
          >
            {valueMenuItems}
          </Select>
        </FormControl>
      </div>
    )
  }
}

Definition.propTypes = {
  classes: PropTypes.object.isRequired,
  encoding: PropTypes.object.isRequired,
  channel: PropTypes.string.isRequired,
  field: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  deleteDefinition: PropTypes.func.isRequired,
  updateDefinition: PropTypes.func.isRequired,
  getPermittedDefinitionFieldValues: PropTypes.func.isRequired,
};

export default Definition
