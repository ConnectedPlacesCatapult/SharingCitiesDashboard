import React from 'react';
import PropTypes from "prop-types";

// material-ui
import { withStyles } from "@material-ui/core/styles";
import { darken, lighten } from "@material-ui/core/styles/colorManipulator";
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

// leaflet
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

//redux
import { connect } from 'react-redux';

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
  getMarkerColor = (val) => {
    // ToDo :: specify a default for this in config and add selector to mapConfig
    const baseColor = this.props.editor.mapConfig.markerColor;
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
    let watchedAttribute = editor.mapConfig.markerAttribute; // ToDo :: this needs to be specified elsewhere
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
    const { classes, config, editor } = this.props;

    // ToDo :: trigger this somewhere better
    this.setValueLimits();

    const tileLayer = config.leafletTileLayers.find(layer => layer.name === editor.mapConfig.tileLayer);

    const heatmapPoints = editor.mapConfig.data.features.map(feature => {
      return [feature.geometry.coordinates[1], feature.geometry.coordinates[0], feature.properties[editor.mapConfig.markerAttribute]]
    });

    const circleFeatures = editor.mapConfig.data.features.map((feature, i) => {
      const propList = editor.mapConfig.tooltipFields.map((key, ii) => {
        return (
          <ListItem key={ii} divider disableGutters>
            <ListItemText>{key}: {feature.properties[key]}</ListItemText>
          </ListItem>
        )
      });

      const markerValue = feature.properties[editor.mapConfig.markerAttribute];

      return (
        <CircleMarker
          key={i}
          center={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}
          stroke={false}
          fillColor={this.getMarkerColor(markerValue)}
          fillOpacity={editor.mapConfig.markerOpacity}
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
};

const mapStateToProps = state => ({
  config: state.config.config,
  editor: state.editor,
});

const mapDispatchToProps = dispatch => ({

});

MapPreview = withStyles(styles, { withTheme: true })(MapPreview);
MapPreview = connect(mapStateToProps, mapDispatchToProps)(MapPreview);

export default MapPreview
