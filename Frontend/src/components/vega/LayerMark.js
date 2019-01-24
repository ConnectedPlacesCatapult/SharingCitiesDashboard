import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import {
  setLayerMark
} from "../../actions/vegaActions";

import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";

const styles = theme => ({
  root: {

  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: theme.spacing.unit * 20,
  },
  formLabel: {

  },
  inputLabel: {

  },
});

class LayerMark extends React.Component {
  setLayerMark = e => {
    this.props.setLayerMark(this.props.layerIndex, e.target.value)
  };

  render() {
    const { classes, config, vega, layerIndex } = this.props;

    const markItems = config.vegaLitePlotTypes.map((markType, i) => {
      return <MenuItem key={i} value={markType}>{markType}</MenuItem>
    });

    return (
      <FormControl htmlFor="plot-layer-mark" className={classes.formControl}>
        <InputLabel className={classes.inputLabel}>Mark</InputLabel>
        <Select
          onChange={this.setLayerMark}
          value={vega.layer[layerIndex].mark}
          inputProps={{
            name: 'plotLayerMark',
            id: 'plot-layer-mark',
          }}
        >
          {markItems}
        </Select>
      </FormControl>
    )
  }
}

const mapStateToProps = state => ({
  config: state.config.config,
  vega: state.vega,
});

const mapDispatchToProps = dispatch => ({
  setLayerMark: (layerIndex, layerMark) => dispatch(setLayerMark(layerIndex, layerMark)),
});

LayerMark.propTypes = {
  classes: PropTypes.object.isRequired,
  layerIndex: PropTypes.number.isRequired,
  config: PropTypes.object.isRequired,
  vega: PropTypes.object.isRequired,
  setLayerMark: PropTypes.func.isRequired,
};

LayerMark = withStyles(styles)(LayerMark);

export default connect(mapStateToProps, mapDispatchToProps)(LayerMark)
