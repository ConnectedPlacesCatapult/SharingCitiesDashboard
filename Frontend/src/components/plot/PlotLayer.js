import React from 'react';
import PropTypes from 'prop-types';

import PlotLayerEncoding from './PlotLayerEncoding';

// redux
import { connect } from 'react-redux';
import {
  deletePlotLayer,
  setPlotLayerMark,
} from "../../actions/plotActions";

// material-ui
import { withStyles } from '@material-ui/core/styles';
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import InputLabel from '@material-ui/core/InputLabel';
import Select from "@material-ui/core/Select";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from "@material-ui/icons/Delete";

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing.unit * 2,
    //backgroundColor: theme.palette.primary.dark,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  button: {
    margin: theme.spacing.unit,
  },
  layers: {
    display: 'flex',
    flexDirection: 'row',
  },
});

class PlotLayer extends React.Component {
  deletePlotLayer = (layerIndex) => e => {
    this.props.deletePlotLayer(layerIndex)
  };

  setPlotLayerMark = (layerIndex) => e => {
    this.props.setPlotLayerMark(layerIndex, e.target.value)
  };

  render() {
    const { classes, config, plot, layerIndex, layer, getMenuItems } = this.props;

    return (
      <div className={classes.root}>
        <FormControl key={layerIndex} className={classes.formControl}>
          <IconButton
            className={classes.button}
            aria-label="Delete layer"
            color="primary"
            onClick={this.deletePlotLayer(layerIndex)}
          >
            <DeleteIcon />
          </IconButton>
          <FormLabel className={classes.inputLabel}>Mark</FormLabel>
          <InputLabel htmlFor="plot-layer-mark">Mark</InputLabel>
          <Select
            onChange={this.setPlotLayerMark(layerIndex)}
            value={layer.mark}
            inputProps={{
              name: 'plot-layer-mark',
              id: 'plot-layer-mark',
            }}
          >
            {getMenuItems(config.vega.plotTypes)}
          </Select>
          <PlotLayerEncoding
            layerIndex={layerIndex}
            encoding={layer.encoding}
            getMenuItems={getMenuItems}
          />
        </FormControl>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  config: state.config.config,
  plot: state.plot,
});

const mapDispatchToProps = (dispatch) => ({
  deletePlotLayer: (layerIndex) => dispatch(deletePlotLayer(layerIndex)),
  setPlotLayerMark: (layerIndex, mark) => dispatch(setPlotLayerMark(layerIndex, mark)),
});

PlotLayer.propTypes = {
  classes: PropTypes.object.isRequired,
  layerIndex: PropTypes.number.isRequired,
  layer: PropTypes.object.isRequired,
  getMenuItems: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired,
  plot: PropTypes.object.isRequired,
  deletePlotLayer: PropTypes.func.isRequired,
  setPlotLayerMark: PropTypes.func.isRequired,
};

PlotLayer = withStyles(styles)(PlotLayer);
PlotLayer = connect(mapStateToProps, mapDispatchToProps)(PlotLayer);

export default PlotLayer
