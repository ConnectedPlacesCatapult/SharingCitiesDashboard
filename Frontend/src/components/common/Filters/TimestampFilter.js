import React from 'react';
import PropTypes from 'prop-types';
import {
  IconButton,
  InputAdornment,
  FormControl,
  FormLabel,
  Typography,
  withStyles,
} from '@material-ui/core';
import DateRangeIcon from '@material-ui/icons/DateRange';
import {
  MuiPickersUtilsProvider,
  DateTimePicker,
} from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import { Slider } from 'material-ui-slider';
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

const getLowestAttributeValue = (data, attr) => {
  return data.reduce((min, p) => p[attr] < min ? p[attr] : min, data[0][attr])
};

const getHighestAttributeValue = (data, attr) => {
  return data.reduce((max, p) => p[attr] > max ? p[attr] : max, data[0][attr]);
};


class TimestampFilter extends React.Component {
  constructor(props) {
    super(props);

    const min = getLowestAttributeValue(props.api.data, 'Timestamp');
    const max = getHighestAttributeValue(props.api.data, 'Timestamp');

    this.state = {
      rangeMin: min,
      rangeMax: max,
      from: min,
      to: max,
      now: Date.now(),
    };
  }

  handlePickerChange = (name) => (date) =>  {
    this.setState({ [name]: date })
  };

  handleSliderChange = (range) => {
    this.setState({
      from: range[0],
      to: range[1],
    })
  };

  render() {
    const { classes, theme } = this.props;

    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
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
            <DateTimePicker
              value={this.state.from}
              onChange={this.handlePickerChange('from')}
              label="From"
              format="llll"
              ampm={false}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton color="primary">
                      <DateRangeIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <DateTimePicker
              value={this.state.to}
              onChange={this.handlePickerChange('to')}
              label="To"
              format="llll"
              ampm={false}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton color="primary">
                      <DateRangeIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <FormLabel>Range</FormLabel>
            <Slider
              range={true}
              min={this.state.rangeMin}
              max={this.state.rangeMax}
              value={[this.state.from, this.state.to]}
              color={theme.palette.primary.main}
              onChange={this.handleSliderChange}
            />
          </FormControl>
        </form>
      </MuiPickersUtilsProvider>
    )
  }
}

const mapStateToProps = (state) => ({
  api: state.api,
  widget: state.widget,
});

const mapDispatchToProps = (dispatch) => ({

});

TimestampFilter = withStyles(styles, { withTheme: true })(TimestampFilter);
TimestampFilter = connect(mapStateToProps, mapDispatchToProps)(TimestampFilter);

export default TimestampFilter
