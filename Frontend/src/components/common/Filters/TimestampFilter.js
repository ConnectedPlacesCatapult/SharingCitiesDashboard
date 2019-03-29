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
import moment from 'moment';
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

// ToDo :: fix so it doesn't break when attribute values is empty
const getOldestTimestamp = (data) => {
  return data
    .map((attr) => attr["Attribute_Values"].reduce((min, current) => current["Timestamp"] < min ? current["Timestamp"] : min, attr["Attribute_Values"][0]["Timestamp"]))
    .reduce((min, current) => (current < min) ? current : min, data[0]["Attribute_Values"][0]["Timestamp"]);
};

// ToDo :: fix so it doesn't break when attribute values is empty
const getLatestTimestamp = (data) => {
  return data
    .map((attr) => attr["Attribute_Values"].reduce((max, current) => current["Timestamp"] > max ? current["Timestamp"] : max, attr["Attribute_Values"][0]["Timestamp"]))
    .reduce((max, current) => (current > max) ? current : max, data[0]["Attribute_Values"][0]["Timestamp"]);
};

class TimestampFilter extends React.Component {
  constructor(props) {
    super(props);

    const min = getOldestTimestamp(props.api.data);
    const max = getLatestTimestamp(props.api.data);

    this.state = {
      rangeMin: min,
      rangeMax: max,
      from: min,
      to: max,
      now: Date.now(),
    }
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    api: PropTypes.object.isRequired,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.api.data !== this.props.api.data) {
      const min = getOldestTimestamp(this.props.api.data);
      const max = getLatestTimestamp(this.props.api.data);

      this.setState({
        rangeMin: min,
        rangeMax: max,
        from: min,
        to: max,
        now: Date.now(),
      })
    }
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
    const { classes, heading, subheading, theme } = this.props;
    const { from, to, rangeMin, rangeMax } = this.state;

    /*const t = moment.unix(from);
    console.log(t);*/

    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <form className={classes.root}>
          {heading &&
            <Typography variant="h6" className={classes.heading}>
              {heading}
            </Typography>
          }
          {subheading &&
            <Typography variant="body2" color="primary">
              {subheading}
            </Typography>
          }
          <FormControl className={classes.formControl}>
            <DateTimePicker
              value={from}
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
              value={to}
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
          {/* ToDo :: get this to parse to state datetimes to timestamp and re-enable it */}
          {/*<FormControl className={classes.formControl}>
            <FormLabel>Range</FormLabel>
            <Slider
              range={true}
              min={rangeMin}
              max={rangeMax}
              value={[from, to]}
              color={theme.palette.primary.main}
              onChange={this.handleSliderChange}
            />
          </FormControl>*/}
        </form>
      </MuiPickersUtilsProvider>
    )
  }
}

const mapStateToProps = (state) => ({
  api: state.api,
});

const mapDispatchToProps = (dispatch) => ({

});

TimestampFilter = withStyles(styles, { withTheme: true })(TimestampFilter);
TimestampFilter = connect(mapStateToProps, mapDispatchToProps)(TimestampFilter);

export default TimestampFilter
