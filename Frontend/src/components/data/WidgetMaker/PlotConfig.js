import React from 'react';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { connect } from 'react-redux';
import { setPlotDescription, setPlotEncoding, setPlotType } from "../../../actions/editorActions";

const styles = theme => ({
  root: {

  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 160,
  },
});

class PlotConfig extends React.Component {
  setPlotType = e => {
    this.props.setPlotType(e.target.value)
  };

  render() {
    const { classes, config, editor } = this.props;

    const menuItems = config.vegaLitePlotTypes.map((plotType, i) => {
      return <MenuItem key={i} value={plotType}>{plotType}</MenuItem>
    });

    return (
      <div className={classes.root}>
        <form>
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
              {menuItems}
            </Select>
          </FormControl>
        </form>
      </div>
    )
  }
}

PlotConfig.propTypes = {
  classes: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  editor: PropTypes.object.isRequired,
  setPlotDescription: PropTypes.func.isRequired,
  setPlotEncoding: PropTypes.func.isRequired,
  setPlotType: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  config: state.config.config,
  editor: state.editor.plotConfig,
});

const mapDispatchToProps = dispatch => ({
  setPlotDescription: desc => dispatch(setPlotDescription(desc)),
  setPlotEncoding: enc => dispatch(setPlotEncoding(enc)),
  setPlotType: type => dispatch(setPlotType(type)),
});

PlotConfig = withStyles(styles)(PlotConfig);

export default connect(mapStateToProps, mapDispatchToProps)(PlotConfig)
