import React from 'react';
import PropTypes from 'prop-types';
import {
  Fade,
  withStyles,
} from '@material-ui/core';
import axios from 'axios';
import WidgetWrapper from './WidgetWrapper';
import LoadingIndicator from './LoadingIndicator';

const FCC_CONFIG = require('./../../../fcc.config');

const styles = (theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 'inherit',
    width: 'inherit',
    marginTop: -theme.spacing.unit * 3,
  },
});

class ForecastWidget extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        Forecast Widget
      </div>
    )
  }
}

ForecastWidget = withStyles(styles)(ForecastWidget);

export default ForecastWidget
