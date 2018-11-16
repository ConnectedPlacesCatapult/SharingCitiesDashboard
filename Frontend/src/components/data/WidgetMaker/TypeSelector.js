import React from 'react';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { connect } from 'react-redux';
import { setWidgetType } from "../../../actions/editorActions";

import PlotConfig from './PlotConfig';
import MapConfig from './MapConfig';
import AlertConfig from './AlertConfig';

const styles = theme => ({
  root: {

  },
  widgetTypeSelector: {
    display: 'flex',
  },
  widgetTypeButton: {
    margin: `${theme.spacing.unit}px`,
    marginLeft: 0,
  },
});

class TypeSelector extends React.Component {
  setWidgetType = e => {
    this.props.setWidgetType(e.currentTarget.value)
  };

  render() {
    const { classes, editor } = this.props;

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
            disabled={!editor.canMap}
          >
            Map
          </Button>
          <Button
            className={classes.widgetTypeButton}
            onClick={this.setWidgetType}
            value="alert"
            variant="contained"
            color="primary"
          >
            Alert
          </Button>
        </div>
        { editor.type === 'plot' && <PlotConfig /> }
        { editor.type === 'map' && <MapConfig /> }
        { editor.type === 'alert' && <AlertConfig /> }
      </div>
    )
  }
}

TypeSelector.propTypes = {
  classes: PropTypes.object.isRequired,
  editor: PropTypes.object.isRequired,
  setWidgetType: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  editor: state.editor,
});

const mapDispatchToProps = dispatch => ({
  setWidgetType: type => dispatch(setWidgetType(type)),
});

TypeSelector = withStyles(styles)(TypeSelector);

export default connect(mapStateToProps, mapDispatchToProps)(TypeSelector)
