import React, { Component } from 'react';
import ReactMapboxGl, { GeoJSONLayer, Layer, Feature, Popup } from "react-mapbox-gl";

import STATE_DATA from './../../data/dummy/stateData.geojson';

const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoiZ290aW1teWdvIiwiYSI6ImNqbWdjNWVxejRicDAzd28yaWI2eTV5bXoifQ.3RrrBFuvbZufD1gAuMwz8Q"
});

class MapBox extends Component {
  render() {

    return (
      <Map
        style={ "mapbox://styles/gotimmygo/cjmgc7tcu1sc12tqwvk9f194x" }
        containerStyle={{
          height: "100vh",
          width: "100vw"
        }}
        //center={[-77.01239, 38.91275]}
        center={[-0.13235092163085938,51.518250335096376]}
      >
        <GeoJSONLayer
          data={STATE_DATA}
          symbolLayout={{
            "text-field": "{place}",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-offset": [0, 0.6],
            "text-anchor": "top"
          }}
          symbolPaint={{
            'text-color': 'white'
          }}
          circleLayout={{
            visibility: 'visible'
          }}
          circlePaint={{
            'circle-color': 'white'
          }}
          fillOnClick={(e) => {
            console.log("fill clicked", e);
          }}
          symbolOnClick={(e) => {
            console.log("symbol clicked", e);
          }}
          circleOnMouseEnter={(e) => {
            console.log("circle entered", e);
          }}
        />
        <Layer
          type="symbol"
          id="marker"
          layout={{ "icon-image": "marker-15" }}
          symbolOnClick={(e) => {
            console.log("symbol clicked", e);
          }}

        >
          {/*<Feature
            coordinates={[-0.481747846041145, 51.3233379650232]}
          />*/}
          <Popup
            coordinates={[-0.13235092163085938,51.518250335096376]}
            offset={{
              'bottom-left': [12, -38],  'bottom': [0, -38], 'bottom-right': [-12, -38]
            }}>
            <h1>Popup</h1>
          </Popup>
        </Layer>
      </Map>
    )
  }
}

export default MapBox;