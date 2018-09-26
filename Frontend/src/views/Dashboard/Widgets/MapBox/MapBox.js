import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ReactMapboxGl, { GeoJSONLayer } from "react-mapbox-gl";

import CONFIG from './config.json';
import BIKE_DATA from './../../../../data/dummy/bikes.geojson';

const styles = theme => ({

});

const symbolLayout = {
  'text-field': '{name} \n {bike}/{dock}',
  'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
  'text-offset': [0, 0.6],
  'text-anchor': 'top'
};
const symbolPaint = { 'text-color': 'green' };
const circleLayout = { visibility: 'visible' };
const circlePaint = { 'circle-color': 'green' };

const Map = ReactMapboxGl({
  accessToken: CONFIG.token
});

class MapBox extends Component {
  onMouseEnterCircle = (evt) => {
    console.log(evt);
  };

  render() {
    return (
      <Map
        style={CONFIG.styles.dark}
        containerStyle={{
          height: "600px",
          width: "800px"
        }}
        center={[-0.13235092163085938,51.518250335096376]}
      >
        <GeoJSONLayer
          data={BIKE_DATA}
          circleLayout={circleLayout}
          circlePaint={circlePaint}
          circleOnMouseEnter={this.onMouseEnterCircle}
          symbolLayout={symbolLayout}
          symbolPaint={symbolPaint}
        />
      </Map>
    )
  }
}

MapBox.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MapBox);