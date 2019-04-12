import React from 'react';
import PropTypes from 'prop-types';
import {
  Fade,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  withStyles,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { darken, lighten } from '@material-ui/core/styles/colorManipulator';
import {
  CircleMarker,
  FeatureGroup,
  GeoJSON,
  LayersControl,
  Map,
  Popup,
  TileLayer,
} from 'react-leaflet';
import HeatmapLayer from 'react-leaflet-heatmap-layer';
import axios from 'axios';
import WidgetWrapper from './WidgetWrapper';
import LoadingIndicator from './LoadingIndicator';

const FCC_CONFIG = require('./../../../fcc.config');

// ToDo :: make this a multi-attribute map from github
// ToDo :: remove default markers

const styles = (theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '90%',
    width: 'auto',
  },
  popupList: {
    backgroundColor: theme.palette.background.default,
  },
});

class MapWidget extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    editor: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    isStatic: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired,
    config: PropTypes.object.isRequired,
    queryParams: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: null,
      data: null,
      error: null,

      // required here?
      //attributes: (props.editor.widget.queryParams && props.editor.widget.queryParams['attributedata']) ? props.editor.widget.queryParams['attributedata'].split(',') : [],
    }
  }

  componentWillMount() {
    this.fetchData()

    const { editor } = this.props;

    const attributes = (editor.widget && editor.widget.queryParams && editor.widget.queryParams['attributedata']) ? editor.widget.queryParams['attributedata'].split(',') : [];
    //console.log(attributes);
  }

  fetchData = () => {
    const { queryParams } = this.props;

    this.setState({ loading: true });

    axios({
      url: FCC_CONFIG.apiRoot + '/data',
      method: 'get',
      params: queryParams,
    })
      .then((response) => {
        this.setState({
          loading: false,
          data: {
            type: "FeatureCollection",
            features: this.formatData(response.data)
          }
        })
      })
      .catch((err) => {
        this.setState({ error: err})
      })
  };

  formatData = (data) => {
    const featureProperties = (feature) => {
      return Object.keys(feature)
        .filter(key => !['Latitude', 'Longitude'].includes(key))
        .reduce((obj, key) => {
          obj[key] = feature[key];
          return obj;
        }, {})
    };

    return data.map((feature) => ({
      type: "Feature",
      properties: featureProperties(feature),
      geometry: {
        type: "Point",
        coordinates: [feature["Longitude"], feature["Latitude"]],
      },
    }));
  };

  setValueLimits = (data) => {
    const { config } = this.props;

    let min = null;
    let max = null;
    let watchedAttribute = config.markerAttribute;

    for (let feature of data.features) {
      let attributeValue = feature.properties[watchedAttribute];

      if (Number.isInteger(attributeValue) || parseFloat(attributeValue)) {
        if (attributeValue < min || min === null) min = attributeValue;
        if (attributeValue > max || max === null) max = attributeValue;
      }
    }

    this.minValue = min;
    this.maxValue = max;
  };

  getMarkerColor = (val) => {
    const { config } = this.props;

    const baseColor = config.markerColor;
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
    const { config } = this.props;

    return config.markerRadius * ((val - this.minValue) / (this.maxValue - this.minValue))
  };

  render() {
    const { classes, i, type, name, description, isStatic, width, height, config, queryParams } = this.props;
    const { loading, error, data } = this.state;

    if (!data) {
      return (
        <WidgetWrapper
          i={i}
          type={type}
          name={name}
          description={description}
          isStatic={isStatic}
          width={width}
          height={height}
          config={config}
          queryParams={queryParams}
        >
          <LoadingIndicator />
        </WidgetWrapper>
      )
    }

    this.setValueLimits(data);

    const tileLayer = FCC_CONFIG.leafletTileLayers.find((layer) => layer.name === config.tileLayer);

    const heatmapPoints = data.features.map((feature) => [feature.geometry.coordinates[1], feature.geometry.coordinates[0], feature.properties[config.markerAttribute]]);

    const circleFeatures = data.features.map((feature, i) => {
      const propList = config.tooltipFields.map((key, ii) => {
        return (
          <ListItem key={ii} divider disableGutters>
            <ListItemText>{key}: {feature.properties[key]}</ListItemText>
          </ListItem>
        )
      });

      const markerValue = feature.properties[config.markerAttribute];

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
      <WidgetWrapper
        i={i}
        type={type}
        name={name}
        description={description}
        isStatic={isStatic}
        width={width}
        height={height}
        config={config}
        queryParams={queryParams}
      >
        <Fade in={!loading}>
          <Map
            className={classes.root}
            center={config.center}
            zoom={config.zoom}
          >
            <LayersControl>
              <LayersControl.BaseLayer name="Basemap" checked>
                <TileLayer
                  attribution={tileLayer.attribution}
                  url={tileLayer.url}
                />
              </LayersControl.BaseLayer>
              <LayersControl.Overlay name="GeoJSON default" checked>
                <GeoJSON data={data} />
              </LayersControl.Overlay>
              <LayersControl.Overlay name="GeoJSON custom" checked>
                <FeatureGroup>
                  {circleFeatures}
                </FeatureGroup>
              </LayersControl.Overlay>
              { config.showHeatmap &&
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
        </Fade>
      </WidgetWrapper>
    )
  }
}

const mapStateToProps = (state) => ({
  editor: state.editor,
});

MapWidget = withStyles(styles)(MapWidget);
MapWidget = connect(mapStateToProps, null)(MapWidget);

export default MapWidget
