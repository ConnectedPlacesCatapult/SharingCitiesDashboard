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
import {
  CircleMarker,
  FeatureGroup,
  LayersControl,
  Map,
  Popup,
  TileLayer,
} from 'react-leaflet';
import axios from 'axios';
import { connect } from 'react-redux';
import ColorScheme from 'color-scheme';
import rgba from 'rgba-convert';
import hexConverter from 'color-shorthand-hex-to-six-digit';
import LoadingIndicator from './LoadingIndicator';
import WidgetWrapper from './WidgetWrapper';

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
  map: {
    width: 'auto',
    height: '100%',
  },
  popupList: {
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing.unit,
  },
  popupListItem: {

  },
});

class MapWidget extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
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

    this.mapRef = React.createRef();
    this.minValue = 0;
    this.maxValue = 0;

    this.state = {
      loading: null,
      rawData: null,
      data: null,
      error: null,
      attributes: [],
      markerColors: [],
      markerOpacity: 1,
    };
  }

  componentWillMount() {
    this.fetchData();
    this.updateStateAttributes();
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps) {

  }

  fetchData = () => {
    const { queryParams } = this.props;

    this.setState({ loading: true }, () => {
      axios({
        url: FCC_CONFIG.apiRoot + '/data',
        method: 'get',
        params: queryParams,
      })
        .then((response) => {
          this.setMinMaxValues(response.data);

          this.setState({
            loading: false,
            rawData: response.data,
            data: {
              type: "FeatureCollection",
              features: this.formatData(response.data)
            }
          })
        })
        .catch((err) => {
          this.setState({ error: err})
        })
    });
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

  updateStateAttributes = () => {
    const { queryParams } = this.props;
    const attributes = (!queryParams['attributedata'] || !queryParams['attributedata'].length)
      ? []
      : queryParams['attributedata'].split(',')
    ;

    this.setState({ attributes }, this.updateColorScheme);
  };

  updateColorScheme = () => {
    const { config } = this.props;

    const baseColor = config.markerColor;
    const baseColorObj = rgba.obj(baseColor);
    const baseColorOpacity = baseColorObj.a / 255;

    delete baseColorObj.a;

    const baseColorLongHandHex = hexConverter(rgba.hex(baseColorObj)).slice(1);

    const scheme = new ColorScheme();
    const colors = scheme.from_hex(baseColorLongHandHex).scheme('analogic').variation('default').colors();

    this.setState({
      markerColors: colors,
      markerOpacity: baseColorOpacity,
    })
  };

  setMinMaxValues = (data) => {
    this.minValue = data.reduce((min, record) => record['Value'] < min ? Number(record['Value']) : min, 0);
    this.maxValue = data.reduce((max, record) => record['Value'] > max ? Number(record['Value']) : max, 0);
  };

  getMarkerRadius = (value) => {
    const { config } = this.props;
    const pc = (value - this.minValue) / (this.maxValue - this.minValue);
    return config.markerRadius * (pc + 0.5)
  };

  getFormattedTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const day = date.getMonth();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${day} ${month} ${year} at ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
  };

  render() {
    const { classes, i, type, name, description, isStatic, width, height, config, queryParams } = this.props;
    const { loading, error, data, attributes, markerColors, markerOpacity } = this.state;

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

    const tileLayer = FCC_CONFIG.leafletTileLayers.find((layer) => layer.name === config.tileLayer);

    const rootStyles = {
      width: `${width}px`,
      height: `${height}px`,
      maxWidth: `${width}px`,
      maxHeight: `${height}px`,
    };

    const featureLayers = attributes.map((attribute, i) => {
      const attributeFeatures = data.features.filter((feature) => feature.properties['Attribute_Name'] === attribute);
      const markers = attributeFeatures.map((feature, ii) => {
        return (
          <CircleMarker
            key={ii}
            center={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}
            stroke={false}
            radius={this.getMarkerRadius(feature.properties['Value'])}
            fillColor={`#${markerColors[i]}`}
            fillOpacity={markerOpacity}
          >
            <Popup>
              <List
                disablePadding={false}
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
                <ListItem className={classes.popupListItem} disableGutters alignItems={'flex-start'}>
                  <ListItemText>{`${feature.geometry.coordinates[1].toFixed(6)}, ${feature.geometry.coordinates[0].toFixed(6)}`}</ListItemText>
                </ListItem>
                <ListItem className={classes.popupListItem} disableGutters alignItems={'flex-start'}>
                  <ListItemText>Attribute: {feature.properties['Attribute_Name']}</ListItemText>
                </ListItem>
                <ListItem className={classes.popupListItem} disableGutters alignItems={'flex-start'}>
                  <ListItemText>Value: {feature.properties['Value']}</ListItemText>
                </ListItem>
                <ListItem className={classes.popupListItem} disableGutters alignItems={'flex-start'}>
                  <ListItemText>Recorded: {this.getFormattedTimestamp(feature.properties['Timestamp'])}</ListItemText>
                </ListItem>
              </List>
            </Popup>
          </CircleMarker>
        )
      });

      return (
        <LayersControl.Overlay
          key={i}
          name={attribute}
          checked
        >
          <FeatureGroup>
            {markers}
          </FeatureGroup>
        </LayersControl.Overlay>
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
            className={classes.map}
            center={config.center}
            zoom={config.zoom}
            ref={this.mapRef}
            //onClick={this.handleMapClick}
            //onLoad={this.handleMapLoad}
            //onMoveEnd={this.handleMapMoveEnd}
            //onResize={this.handleMapResize}
          >
            <LayersControl>
              <LayersControl.BaseLayer name="Basemap" checked>
                <TileLayer
                  attribution={tileLayer.attribution}
                  url={tileLayer.url}
                />
              </LayersControl.BaseLayer>
              {featureLayers}
            </LayersControl>
          </Map>
        </Fade>
      </WidgetWrapper>
    )
  }
}

const mapStateToProps = (state) => ({

});

MapWidget = withStyles(styles)(MapWidget);
MapWidget = connect(null, null)(MapWidget);

export default MapWidget
