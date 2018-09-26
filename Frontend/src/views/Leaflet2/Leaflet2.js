import React, { Component } from 'react';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import L from 'leaflet';

//import BIKE_DATA from './../../data/dummy/bikes.geojson';

const BIKE_DATA = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "id": 1,
      "properties": {
        "name": "Austin Road, Battersea Park",
        "bike": 9,
        "dock": 24,
        "dock_id": 1
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          -0.155442,
          51.474376
        ]
      }
    },
    {
      "type": "Feature",
      "id": 2,
      "properties": {
        "name": "Royal Avenue 1, Chelsea",
        "bike": 2,
        "dock": 10,
        "dock_id": 2
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          -0.162727,
          51.489932
        ]
      }
    }
  ]
};

const CONFIG = {
  params: {
    center: [51.505, -0.09],
    zoomControl: false,
    zoom: 13,
    maxZoom: 19,
    minZoom: 11,
    scrollwheel: false,
    legends: true,
    infoControl: false,
    attributionControl: true
  },
  tileLayer: {
    uri: "http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
    params: {
      minZoom: 11,
      attribution: "&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
    }
  }
};

const styles = theme => ({
  root: {
    display: 'flex',
  },
  leafletContainer: {
    height: '400px',
    width: '80%',
    margin: '0 auto',
  },
});

class Leaflet2 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      map: null,
      tileLayer: null,
      geoJsonLayer: null,
      geoJson: null,
      numDocks: null
    };

    this._mapNode = null;
  }

  componentDidMount() {
    this.getData();

    if (!this.state.map) {
      this.init(this._mapNode);
    }
  }

  componentDidUpdate() {
    if (this.state.geoJson && this.state.map && !this.state.geoJsonLayer) {
      this.addGeoJSONLayer(this.state.geoJson);
    }
  }

  componentWillUnmount() {
    this.state.map.remove();
  }

  getData() {
    this.setState({
      geoJson: BIKE_DATA,
      numDocks: BIKE_DATA.features.length
    });
  }

  addGeoJSONLayer(geoJson) {
    const geoJsonLayer = L.geoJson(geoJson, {
      onEachFeature: this.onEachFeature,
      pointToLayer: this.pointToLayer
    });

    geoJsonLayer.addTo(this.state.map);

    this.setState({ geoJsonLayer });

    this.zoomToFeature(geoJsonLayer);
  }

  zoomToFeature(target) {
    let fitBoundsParams = {
      paddingTopLeft: [200, 10],
      paddingBottomRight: [10, 10]
    };

    this.state.map.fitBounds(target.getBounds(), fitBoundsParams);
  }

  pointToLayer(feature, latlng) {
    let markerParams = {
      radius: 4,
      fillColor: 'orange',
      color: '#fff',
      weight: 1,
      opacity: 0.5,
      fillOpacity: 0.8
    };

    return L.circleMarker(latlng, markerParams);
  }

  onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.name && feature.properties.bike && feature.properties.dock) {

      // assemble the HTML for the markers' popups (Leaflet's bindPopup method doesn't accept React JSX)
      let popupContent = `<h3>${feature.properties.name}</h3>${feature.properties.bike} of ${feature.properties.dock} available`;
      layer.bindPopup(popupContent);
    }
  }

  init(id) {
    if (this.state.map) {
      return;
    }

    let map = L.map(id, CONFIG.params);
    L.control.zoom({ position: "bottomleft"}).addTo(map);
    L.control.scale({ position: "bottomleft"}).addTo(map);

    let tileLayer = L.tileLayer(CONFIG.tileLayer.uri, CONFIG.tileLayer.params).addTo(map);

    this.setState({ map, tileLayer });
  }

  /*state = {
    lat: 51.505,
    lng: -0.09,
    zoom: 13,
  };*/

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.leafletContainer} ref={(node) => this._mapNode = node} id="map" />
      </div>
    )
  }
}

Leaflet2.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Leaflet2);