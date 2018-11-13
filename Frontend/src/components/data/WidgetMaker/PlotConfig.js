import React from 'react';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { connect } from 'react-redux';
import { purgeEditor, setPlotType } from "../../../actions/editorActions";

const styles = theme => ({
  root: {

  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
});

class PlotConfig extends React.Component {
  setPlotType = e => {
    this.props.setPlotType(e.target.value)
  };

  render() {
    const { classes, editor } = this.props;

    return (
      <div className={classes.root}>
        <form>
          <FormControl htmlFor="plot-type" className={classes.formControl}>
            <InputLabel>Chart style</InputLabel>
            <Select
              onChange={this.setPlotType}
              value="bar"
              inputProps={{
                name: 'plotType',
                id: 'plot-type',
              }}
            >
              <MenuItem value="bar">Bar</MenuItem>
              <MenuItem value="line">Line</MenuItem>
              <MenuItem value="pie">Pie</MenuItem>
              <MenuItem value="scatter">Scatter</MenuItem>
            </Select>
          </FormControl>
        </form>
      </div>
    )
  }
}

PlotConfig.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  editor: PropTypes.object.isRequired,
  purgeEditor: PropTypes.func.isRequired,
  setPlotType: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  data: state.data,
  editor: state.editor,
});

const mapDispatchToProps = dispatch => ({
  purgeEditor: () => dispatch(purgeEditor()),
  setPlotType: type => dispatch(setPlotType(type)),
});

PlotConfig = withStyles(styles)(PlotConfig);

export default connect(mapStateToProps, mapDispatchToProps)(PlotConfig)
