import React from 'react';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from '@material-ui/core/Divider';
import { connect } from 'react-redux';
import {
  setPlotDescription,
  setPlotEncoding,
  setPlotType,
} from "../../../actions/editorActions";

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: theme.spacing.unit * 20,
  },
  spacer: {
    margin: `${theme.spacing.unit}px 0`,
  },
});

class PlotConfig extends React.Component {
  setPlotType = e => {
    this.props.setPlotType(e.target.value)
  };

  setPlotLabels = e => {
    this.props.setPlotEncoding({
      axis: "x",
      field: e.target.value,
      type: "ordinal",
    });
  };

  setPlotValues = e => {
    this.props.setPlotEncoding({
      axis: "y",
      field: e.target.value,
      type: "quantitative",
    });
  };

  render() {
    const { classes, config, editor, meta } = this.props;

    const typeItems = config.vegaLitePlotTypes.map((plotType, i) => {
      return <MenuItem key={i} value={plotType}>{plotType}</MenuItem>
    });

    // const nonNumericColumns = meta.columns.filter(column => !column.numeric);
    // const numericColumns = meta.columns.filter(column => column.numeric);
    // const nonGeoNumericColumns = numericColumns.filter((column) => !['lat', 'lon'].includes(column.id));

    /*const labelItems = nonNumericColumns.map((column, i) => {
      return <MenuItem key={i} value={column.id}>{column.label}</MenuItem>
    });*/

    /*const valueItems = nonGeoNumericColumns.map((column, i) => {
      return <MenuItem key={i} value={column.id}>{column.label}</MenuItem>
    });*/

    return (
      <form className={classes.root}>
        <FormControl htmlFor="plot-type" className={classes.formControl}>
          <InputLabel>Chart style</InputLabel>
          <Select
            onChange={this.setPlotType}
            value={editor.spec.mark}
            inputProps={{
              name: 'plotType',
              id: 'plot-type',
            }}
          >
            {typeItems}
          </Select>
        </FormControl>
        <Divider className={classes.spacer} />
        <FormControl htmlFor="plot-labels" className={classes.formControl}>
          <InputLabel>Labels</InputLabel>
          <Select
            onChange={this.setPlotLabels}
            //value={editor.spec.encoding.x.field}
            value={null}
            inputProps={{
              name: 'labels',
              id: 'plot-labels',
            }}
          >
            {/*{labelItems}*/}
          </Select>
        </FormControl>
        <FormControl htmlFor="plot-values" className={classes.formControl}>
          <InputLabel>Values</InputLabel>
          <Select
            onChange={this.setPlotValues}
            //value={editor.spec.encoding.y.field}
            value={null}
            inputProps={{
              name: 'labels',
              id: 'plot-values',
            }}
          >
            {/*{valueItems}*/}
          </Select>
        </FormControl>
      </form>
    )
  }
}

PlotConfig.propTypes = {
  classes: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  editor: PropTypes.object.isRequired,
  //meta: PropTypes.object.isRequired,
  setPlotDescription: PropTypes.func.isRequired,
  setPlotEncoding: PropTypes.func.isRequired,
  setPlotType: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  config: state.config.config,
  editor: state.editor.plotConfig,
  //meta: state.data.meta,
});

const mapDispatchToProps = dispatch => ({
  setPlotDescription: desc => dispatch(setPlotDescription(desc)),
  setPlotEncoding: enc => dispatch(setPlotEncoding(enc)),
  setPlotType: type => dispatch(setPlotType(type)),
});

PlotConfig = withStyles(styles)(PlotConfig);

export default connect(mapStateToProps, mapDispatchToProps)(PlotConfig)
