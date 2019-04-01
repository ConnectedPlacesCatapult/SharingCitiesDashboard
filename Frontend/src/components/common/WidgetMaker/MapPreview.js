import React from 'react';
import PropTypes from 'prop-types';
import {
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  withStyles,
} from '@material-ui/core';
import { darken, lighten } from '@material-ui/core/styles/colorManipulator';
import { connect } from 'react-redux';
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

const styles = (theme) => ({
  root: {
    display: 'flex',
  },
  widget: {
    width: '570px',
    height: '340px',
  },
  popupList: {
    backgroundColor: theme.palette.background.default,
  },
});

class MapPreview extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    mapConfig: PropTypes.object.isRequired,
  };

  getMarkerColor = (val) => {
    const { mapConfig } = this.props;

    const baseColor = mapConfig.markerColor;
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
    const { mapConfig } = this.props;

    return mapConfig.markerRadius * ((val - this.minValue) / (this.maxValue - this.minValue))
  };

  setValueLimits = () => {
    const { mapConfig } = this.props;

    let min = null;
    let max = null;
    let watchedAttribute = mapConfig.markerAttribute;
    let features = mapConfig.data.features;

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
    const { classes, config, mapConfig } = this.props;

    // ToDo :: trigger this somewhere better
    this.setValueLimits();

    const tileLayer = config.leafletTileLayers.find(layer => layer.name === mapConfig.tileLayer);

    const heatmapPoints = mapConfig.data.features.map(feature => {
      return [feature.geometry.coordinates[1], feature.geometry.coordinates[0], feature.properties[mapConfig.markerAttribute]]
    });

    const circleFeatures = mapConfig.data.features.map((feature, i) => {
      const propList = mapConfig.tooltipFields.map((key, ii) => {
        return (
          <ListItem key={ii} divider disableGutters>
            <ListItemText>{key}: {feature.properties[key]}</ListItemText>
          </ListItem>
        )
      });

      const markerValue = feature.properties[mapConfig.markerAttribute];

      return (
        <CircleMarker
          key={i}
          center={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}
          stroke={false}
          fillColor={this.getMarkerColor(markerValue)}
          radius={this.getMarkerRadius(markerValue)}
        >
          <Popup>
            <List
              disablePadding={true}
              dense
              className={classes.popupList}
            >
              <ListSubheader
                disableGutters
                disableSticky
                inset={false}
              >
                {feature.properties["Name"]}
              </ListSubheader>
              {propList}
            </List>
          </Popup>
        </CircleMarker>
      )
    });

    return (
      <div className={classes.root}>
        <Map
          className={classes.widget}
          center={mapConfig.center}
          zoom={mapConfig.zoom}
        >
          <LayersControl>
            <LayersControl.BaseLayer name="Basemap" checked>
              <TileLayer
                attribution={tileLayer.attribution}
                url={tileLayer.url}
              />
            </LayersControl.BaseLayer>
            <LayersControl.Overlay name="GeoJSON default" checked>
              <GeoJSON data={mapConfig.data} />
            </LayersControl.Overlay>
            <LayersControl.Overlay name="GeoJSON custom" checked>
              <FeatureGroup>
                {circleFeatures}
              </FeatureGroup>
            </LayersControl.Overlay>
            { mapConfig.showHeatmap &&
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

const mapStateToProps = (state) => ({
  config: state.config.config,
  mapConfig: state.widget.mapConfig,
});

MapPreview = withStyles(styles, { withTheme: true })(MapPreview);
MapPreview = connect(mapStateToProps, null)(MapPreview);

export default MapPreview
