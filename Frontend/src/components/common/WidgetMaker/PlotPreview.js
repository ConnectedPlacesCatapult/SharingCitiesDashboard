import React from 'react';
import PropTypes from "prop-types";

// material-ui
import { withStyles } from "@material-ui/core/styles";

// redux
import { connect } from 'react-redux';

// vega
import VegaLite from 'react-vega-lite';

const styles = (theme) => ({
  root: {

  },
  widget: {

  },
});

class PlotPreview extends React.Component {
  render() {
    const { classes, plotConfig } = this.props;

    const spec = {
      ...plotConfig.spec,
    };

    return (
      <div className={classes.root}>
        <VegaLite
          spec={spec}
          data={plotConfig.data}
        />
      </div>
    )
  }
}

PlotPreview.propTypes = {
  classes: PropTypes.object.isRequired,
  plotConfig: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  plotConfig: state.widget.plotConfig,
});

const mapDispatchToProps = (dispatch) => ({

});

PlotPreview = withStyles(styles)(PlotPreview);
PlotPreview = connect(mapStateToProps, mapDispatchToProps)(PlotPreview);

export default PlotPreview
