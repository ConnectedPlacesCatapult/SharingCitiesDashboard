import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import {
  InputLabel,
  FormControl,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';

import { connect } from 'react-redux';
/*import {
  clearFilters,
  toggleFilter,
} from "../../../actions/filtersActions";*/

import {
  FILTER_VALUE_EXACT,
} from './../../../constants';

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  formControl: {
    margin: `${theme.spacing.unit}px 0`,
    minWidth: 175,
  },
});

class TypeFilter extends React.Component {
  state = {
    sensor: '',
    attribute: '',
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });

    //this.props.toggleFilter(FILTER_VALUE_EXACT, e.target.name, {value: e.target.value})
  };

  render() {
    const { classes, api } = this.props;

    const uniqueSensors = [...new Set(api.data.map(attr => attr['Attribute_Values'].map(val => val['Name'])).flat().sort())];
    const sensorMenuItems = uniqueSensors.map((sensor, i) => <MenuItem key={i} value={sensor}>{sensor}</MenuItem>);

    //const uniqueAttributes = [...new Set(api.data.map((record) => record['Attribute_Name']))].sort();
    //const attributeMenuItems = uniqueAttributes.map((sensor, i) => <MenuItem key={i} value={sensor}>{sensor}</MenuItem>);

    return (
      <form className={classes.root}>
        {this.props.heading &&
          <Typography variant="h6" className={classes.heading}>
            {this.props.heading}
          </Typography>
        }
        {this.props.subheading &&
          <Typography variant="body2" color="primary">
            {this.props.subheading}
          </Typography>
        }
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="sensor-filter">by Sensor</InputLabel>
          <Select
            value={this.state.sensor}
            onChange={this.handleChange}
            inputProps={{
              name: 'Name',
              id: 'sensor-filter',
            }}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            {sensorMenuItems}
          </Select>
        </FormControl>
        {/*<FormControl className={classes.formControl}>
          <InputLabel htmlFor="attribute-filter">by Attribute</InputLabel>
          <Select
            value={this.state.attribute}
            onChange={this.handleChange}
            inputProps={{
              name: 'attribute',
              id: 'attribute-filter',
            }}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            {attributeMenuItems}
          </Select>
        </FormControl>*/}
      </form>
    )
  }
}

const mapStateToProps = (state) => ({
  api: state.api,
  //filters: state.filters,
});

const mapDispatchToProps = (dispatch) => ({
  //clearFilters: () => dispatch(clearFilters()),
  //toggleFilter: (type, field, ...rest) => dispatch(toggleFilter(type, field, ...rest)),
});

TypeFilter = withStyles(styles)(TypeFilter);
TypeFilter = connect(mapStateToProps, mapDispatchToProps)(TypeFilter);

export default TypeFilter
