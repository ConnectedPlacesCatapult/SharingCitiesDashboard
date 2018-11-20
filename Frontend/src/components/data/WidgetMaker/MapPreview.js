import React from 'react';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { darken, lighten } from "@material-ui/core/styles/colorManipulator";
import {
  CircleMarker,
  FeatureGroup,
  GeoJSON,
  LayersControl,
  Map,
  Marker,
  Popup,
  TileLayer,
  Circle,
} from 'react-leaflet';
import HeatmapLayer from 'react-leaflet-heatmap-layer';
import { connect } from 'react-redux';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  widget: {
    width: '570px',
    height: '340px',
  },
});

class MapPreview extends React.Component {
  getMarkerColor = (val) => {
    // ToDo :: specify a default for this in config and add selector to mapConfig
    const baseColor = this.props.theme.palette.secondary.light;
    const diff = this.maxValue - this.minValue;
    const step = diff / 5;

    switch(true) {
      case val > (4 * step) + this.minValue:
        return lighten(baseColor, 0.5);
      case val > (3 * step) + this.minValue:
        return lighten(baseColor, 0.25);
      case val > (2 * step) + this.minValue:
        return baseColor;
      case val > step + this.minValue:
        return darken(baseColor, 0.25);
      default:
        return darken(baseColor, 0.5);
    }
  };

  getMarkerRadius = (val) => {
    // ToDo :: specify a default for this in config and add selector to mapConfig
    const maxRadius = 60;

    return maxRadius * ((val - this.minValue) / (this.maxValue - this.minValue))
  };

  setValueLimits = () => {
    const { editor } = this.props;

    let min = null;
    let max = null;
    let watchedAttribute = editor.mapConfig.heatmapAttribute; // ToDo :: this needs to be specified elsewhere
    let features = editor.mapConfig.data.features;

    for (let feature of features) {
      let attributeValue = feature.properties[watchedAttribute];

      if (Number.isInteger(attributeValue) || parseFloat(attributeValue)) {
        if (attributeValue < min || min === null) min = attributeValue;
        if (attributeValue > max || max === null) max = attributeValue;
      }
    }

    this.minValue = min;
    this.maxValue = max;
  };

  render() {
    const { classes, config, editor, meta } = this.props;

    // ToDo :: trigger this somewhere better
    this.setValueLimits();

    const tileLayer = config.leafletTileLayers.find(layer => layer.name === editor.mapConfig.tileLayer);

    const heatmapPoints = editor.mapConfig.data.features.map(feature => {
      return [feature.geometry.coordinates[1], feature.geometry.coordinates[0], feature.properties[editor.mapConfig.heatmapAttribute]]
    });

    const circleFeatures = editor.mapConfig.data.features.map((feature, i) => {

      // ToDo :: get Popup content from meta

      return (
        <CircleMarker
          key={i}
          center={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}
          stroke={false}
          fillColor={this.getMarkerColor(feature.properties[editor.mapConfig.heatmapAttribute])}
          fillOpacity={0.7}
          radius={this.getMarkerRadius(feature.properties[editor.mapConfig.heatmapAttribute])}
        >
          <Popup>
            <h3>{feature.properties.name}</h3>
            <p>{feature.properties.bike} of {feature.properties.dock} available</p>
          </Popup>
        </CircleMarker>
      )
    });

    return (
      <div className={classes.root}>
        <Map
          className={classes.widget}
          center={editor.mapConfig.center}
          zoom={editor.mapConfig.zoom}
        >
          <LayersControl>
            <LayersControl.BaseLayer name="Basemap" checked>
              <TileLayer
                attribution={tileLayer.attribution}
                url={tileLayer.url}
              />
            </LayersControl.BaseLayer>
            <LayersControl.Overlay name="GeoJSON default" checked>
              <GeoJSON data={editor.mapConfig.data} />
            </LayersControl.Overlay>
            <LayersControl.Overlay name="GeoJSON custom" checked>
              <FeatureGroup>
                {circleFeatures}
              </FeatureGroup>
            </LayersControl.Overlay>
            { editor.mapConfig.showHeatmap &&
              <LayersControl.Overlay name="Heatmap" checked>
                <FeatureGroup>
                  <HeatmapLayer
                    fitBoundsOnLoad
                    fitBoundsOnUpdate
                    points={heatmapPoints}
                    longitudeExtractor={m => m[1]}
                    latitudeExtractor={m => m[0]}
                    intensityExtractor={m => parseFloat(m[2])}
                  />
                </FeatureGroup>
              </LayersControl.Overlay>
            }
          </LayersControl>
        </Map>
      </div>
    )
  }
}

MapPreview.propTypes = {
  classes: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  editor: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  config: state.config.config,
  editor: state.editor,
  meta: state.data.meta,
});

const mapDispatchToProps = dispatch => ({

});

MapPreview = withStyles(styles, { withTheme: true })(MapPreview);

export default connect(mapStateToProps, mapDispatchToProps)(MapPreview)
