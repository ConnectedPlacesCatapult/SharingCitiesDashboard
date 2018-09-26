import React, { Component } from 'react';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Map, Marker, Popup, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';

import CONFIG from './config';
//import BIKE_DATA from './../../data/dummy/bikes.geojson';
//import STATE_DATA from './../../data/dummy/stateData.geojson';

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

class Leaflet extends Component {
  state = {
    lat: 51.505,
    lng: -0.09,
    zoom: 13,
  };

  onEachFeature = (feature, layer) => {
    let popupContent = `<h3>${feature.properties.name}</h3>${feature.properties.bike} / ${feature.properties.dock}`;
    let pp = <Popup >feature.properties.name</Popup>;

    layer.bindPopup(pp)


    return (
      <Marker>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    );



      /*.on({
        mouseover: () => {},
        mouseout: () => {},
        click: () => {
          //console.log(feature.properties);
        }
      })*/
    ;
  };

  pointToLayer = (feature, latlng) => {
    let markerParams = {
      radius: 4,
      fillColor: 'orange',
      color: '#fff',
      weight: 1,
      opacity: 0.5,
      fillOpacity: 0.8
    };

    return L.circleMarker(latlng, markerParams);
    /*return (
      <Marker
        position={latlng}

      />
    )*/
  };

  render() {
    const { classes } = this.props;
    const { lat, lng, zoom } = this.state;

    const position = [lat, lng];

    return (
    <div className={classes.root}>
      <Map className={classes.leafletContainer} center={position} zoom={zoom}>
        <TileLayer
          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url={CONFIG.tileLayerUrl}
        />
        <GeoJSON
          data={BIKE_DATA}
          onEachFeature={this.onEachFeature}
          pointToLayer={this.pointToLayer}
        />
      </Map>
    </div>
    )
  }
}

Leaflet.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Leaflet);