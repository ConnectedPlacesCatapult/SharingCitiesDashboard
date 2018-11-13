import React from 'react';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Collapse from '@material-ui/core/Collapse';
import { connect } from 'react-redux';
import { purgeEditor, setPlotType, setWidgetType } from "../../../actions/editorActions";

import PlotConfig from './PlotConfig';
import MapConfig from './MapConfig';

const styles = theme => ({
  root: {

  },
  widgetTypeSelector: {
    display: 'flex',
  },
  widgetTypeButton: {
    margin: `${theme.spacing.unit}px auto`,
  },
});

class TypeSelector extends React.Component {
  state = {
    widgetType: 'plot',
  };

  setWidgetType = e => {
    this.setState({ widgetType: e.currentTarget.value });

    this.props.setWidgetType(e.currentTarget.value)
  };

  render() {
    const { classes, data, editor } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.widgetTypeSelector}>
          <Button
            className={classes.widgetTypeButton}
            onClick={this.setWidgetType}
            value="plot"
            variant="contained"
            color="primary"
          >
            Chart
          </Button>
          <Button
            className={classes.widgetTypeButton}
            onClick={this.setWidgetType}
            value="map"
            variant="contained"
            color="primary"
          >
            Map
          </Button>
        </div>
        {
          this.state.widgetType === 'plot'
          ? <PlotConfig />
          : <MapConfig />
        }
      </div>
    )
  }
}

TypeSelector.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  editor: PropTypes.object.isRequired,
  purgeEditor: PropTypes.func.isRequired,
  setWidgetType: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  data: state.data,
  editor: state.editor,
});

const mapDispatchToProps = dispatch => ({
  purgeEditor: () => dispatch(purgeEditor()),
  setWidgetType: type => dispatch(setWidgetType(type)),
});

TypeSelector = withStyles(styles)(TypeSelector);

export default connect(mapStateToProps, mapDispatchToProps)(TypeSelector)
