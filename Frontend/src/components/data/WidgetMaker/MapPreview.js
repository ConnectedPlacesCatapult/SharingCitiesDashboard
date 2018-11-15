import React from 'react';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { CircleMarker, FeatureGroup, GeoJSON, LayersControl, Map, Marker, Popup, TileLayer, Circle} from 'react-leaflet';
//import HeatmapLayer from 'react-leaflet-heatmap-layer';
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
  render() {
    const { classes, config, editor } = this.props;

    const tileLayer = config.leafletTileLayers.find(layer => layer.name === editor.mapConfig.tileLayer);

    return (
      <div className={classes.root}>
        <Map
          className={classes.widget}
          center={editor.mapConfig.center}
          zoom={editor.mapConfig.zoom}
        >
          <TileLayer
            attribution={tileLayer.attribution}
            url={tileLayer.url}
          />
          <GeoJSON data={editor.mapConfig.data} />
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
