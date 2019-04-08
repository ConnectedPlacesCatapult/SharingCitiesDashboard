import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
  withStyles,
} from '@material-ui/core';
import { connect } from 'react-redux';
import LoadingIndicator from './../../Widget/LoadingIndicator';

const FCC_CONFIG = require('./../../../../fcc.config');

const styles = (theme) => ({
  root: {

  },
});

class ForecastPreview extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    editor: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      data: null,
      error: null,
      loading: false,
    }
  }

  render() {
    const { classes } = this.props;
    const { data, error, loading } = this.state;

    if (loading) {
      return (
        <div className={classes.root}>
          <LoadingIndicator />
        </div>
      )
    }

    return (
      <div className={classes.root}>
        <Typography variant="subtitle2">Forecast Preview</Typography>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  editor: state.editor,
});

ForecastPreview = withStyles(styles)(ForecastPreview);
ForecastPreview = connect(mapStateToProps, null)(ForecastPreview);

export default ForecastPreview
