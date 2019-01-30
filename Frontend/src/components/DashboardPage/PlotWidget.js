import React from 'react';
import PropTypes from "prop-types";

// material-ui
import { withStyles } from "@material-ui/core/styles";

// vega
import VegaLite from 'react-vega-lite';

const styles = (theme) => ({
  root: {
    display: 'flex',
  },
});

class PlotWidget extends React.Component {
  render() {
    const { classes, spec, data } = this.props;

    return (
      <VegaLite
        className={classes.root}
        spec={spec}
        data={data}
      />
    )
  }
}

PlotWidget.propTypes = {
  classes: PropTypes.object.isRequired,
};

PlotWidget = withStyles(styles)(PlotWidget);

export default PlotWidget
