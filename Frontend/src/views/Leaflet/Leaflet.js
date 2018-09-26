import React, { Component } from 'react';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

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

  render() {
    const { classes } = this.props;
    const { lat, lng, zoom } = this.state;

    const position = [lat, lng];

    return (
      <div className={classes.root}>
        <Map className={classes.leafletContainer} center={position} zoom={zoom}>
          <TileLayer
            attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </Map>
      </div>
    )
  }
}

Leaflet.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Leaflet);