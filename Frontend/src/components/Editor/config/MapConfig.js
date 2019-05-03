import React from 'react';
import PropTypes from 'prop-types';
import {
  Divider,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  withStyles,
} from '@material-ui/core';
import ColorPicker from 'material-ui-color-picker';
import { connect } from 'react-redux';
import { setWidgetConfigProperty } from './../../../actions/editorActions';

const FCC_CONFIG = require('./../../../../fcc.config');

const styles = (theme) => ({
  root: {
    flexDirection: 'column',
    padding: theme.spacing.unit,
  },
});

class MapConfig extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    editor: PropTypes.object.isRequired,
    setWidgetConfigProperty: PropTypes.func.isRequired,
  };

  setMapProperty = (property) => (e) => {
    this.props.setWidgetConfigProperty(property, e.target.value)
  };

  setMapMarkerColor = (color) => {
    this.props.setWidgetConfigProperty('markerColor', color)
  };

  render() {
    const { classes, editor } = this.props;

    const tileLayerMenuItems = FCC_CONFIG.leafletTileLayers.map((tileLayer, i) => {
      return <MenuItem key={i} value={tileLayer.name}>{tileLayer.name}</MenuItem>
    });

    return (
      <FormGroup className={classes.root}>
        <br />
        <FormControl htmlFor="map-tile-layer">
          <InputLabel htmlFor="map-tile-layer">Tile layer</InputLabel>
          <Select
            onChange={this.setMapProperty('tileLayer')}
            value={editor.widget.config.tileLayer}
            inputProps={{
              id: 'map-tile-layer',
            }}
          >
            {tileLayerMenuItems}
          </Select>
        </FormControl>
        <br />
        <FormControl htmlFor="map-marker-color">
          <ColorPicker
            style={{ 'z-index': 3 }}
            label="Marker color and opacity"
            defaultValue='#000'
            value={editor.widget.config.markerColor}
            onChange={(color) => this.setMapMarkerColor(color)}
            inputProps={{ id: 'map-marker-color' }}
          />
        </FormControl>
      </FormGroup>
    )
  }
}

const mapStateToProps = (state) => ({
  editor: state.editor,
});

const mapDispatchToProps = (dispatch) => ({
  setWidgetConfigProperty: (property, value) => dispatch(setWidgetConfigProperty(property, value)),
});

MapConfig = withStyles(styles)(MapConfig);
MapConfig = connect(mapStateToProps, mapDispatchToProps)(MapConfig);

export default MapConfig
