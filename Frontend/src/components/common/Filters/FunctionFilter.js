import React from 'react';
import PropTypes from 'prop-types';
import {
  InputLabel,
  FormControl,
  MenuItem,
  Select,
  Typography,
  withStyles,
} from '@material-ui/core';
import { connect } from 'react-redux';

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

class FunctionFilter extends React.Component {
  state = {
    aggregate: '',
    value: '',
  };

  static propTypes = {
    classes: PropTypes.object.isRequired,

  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  };

  render() {
    const { classes } = this.props;

    const functionMenuItems = ['mean', 'min', 'max'].map((func, i) => <MenuItem key={i} value={func}>{func}</MenuItem>);

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
          <InputLabel htmlFor="aggregate-filter">Aggregate function</InputLabel>
          <Select
            value={this.state.aggregate}
            onChange={this.handleChange}
            inputProps={{
              name: 'aggregate',
              id: 'aggregate-filter',
            }}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            {functionMenuItems}
          </Select>
        </FormControl>
      </form>
    )
  }
}

const mapStateToProps = (state) => ({
  api: state.api,
});

FunctionFilter = withStyles(styles)(FunctionFilter);
FunctionFilter = connect(mapStateToProps, {})(FunctionFilter);

export default FunctionFilter
