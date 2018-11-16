import React from 'react';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { CircleMarker, FeatureGroup, GeoJSON, LayersControl, Map, Marker, Popup, TileLayer, Circle} from 'react-leaflet';
//import HeatmapLayer from 'react-leaflet-heatmap-layer';
import { connect } from 'react-redux';
import HeatmapLayer from "react-leaflet-heatmap-layer";

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
  render() {
    const { classes, config, editor } = this.props;

    const tileLayer = config.leafletTileLayers.find(layer => layer.name === editor.mapConfig.tileLayer);
    const heatmapPoints = editor.mapConfig.data.features.map(feature => {
      return [feature.geometry.coordinates[1], feature.geometry.coordinates[0], feature.properties[editor.mapConfig.heatmapAttribute]]
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
            <LayersControl.Overlay name="GeoJSON" checked>
              <GeoJSON data={editor.mapConfig.data} />
            </LayersControl.Overlay>
            { editor.mapConfig.showHeatmap &&
              <LayersControl.Overlay name="Heatmap" checked>
                <FeatureGroup color="purple">
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

MapPreview = withStyles(styles)(MapPreview);

export default connect(mapStateToProps, mapDispatchToProps)(MapPreview)
