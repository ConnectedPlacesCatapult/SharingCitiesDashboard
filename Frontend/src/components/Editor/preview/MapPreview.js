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
import LoadingIndicator from './../../Widget/LoadingIndicator';

const FCC_CONFIG = require('./../../../../fcc.config');

const styles = (theme) => ({
  root: {
    transition: 'all 0.2s ease',
    width: 'auto',
    height: '100%',
    maxWidth: 0,
    maxHeight: 0,
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

class MapPreview extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    editor: PropTypes.object.isRequired,
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
    //this.element = this.mapRef.getLeafletElement();

    //console.log(this.mapRef);
    //console.log(element);
  }

  componentDidUpdate(prevProps) {
    const { editor } = this.props;

    /*if (this.mapRef.current) {
      this.mapRef.current.leafletElement.invalidateSize();
    }*/

    /*if (editor.widget.width !== prevProps.editor.widget.width || editor.widget.height !== prevProps.editor.widget.height) {
      console.log('width or height updated');
    }*/

    if (editor.widget.queryParams !== prevProps.editor.widget.queryParams) {
      this.fetchData();
      this.updateStateAttributes();
    }

    if (editor.widget.config.markerColor !== prevProps.editor.widget.config.markerColor) {
      this.updateColorScheme()
    }

    if (this.mapRef.current && editor.widget.config.bounds) {
      const map = this.mapRef.current.leafletElement;

      map.fitBounds(editor.widget.config.bounds);

      // console.log(this.mapRef.current.leafletElement);
      // const bounds = this.mapRef.current.leafletElement.getBounds();
      // console.log(bounds);


    }
  }

  fetchData = () => {
    const { editor, loading } = this.props;

    if (loading) return;

    this.setState({ loading: true }, () => {
      axios({
        url: FCC_CONFIG.apiRoot + '/data',
        method: 'get',
        params: editor.widget.queryParams,
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
    const { editor } = this.props;
    const attributes = (!editor.widget.queryParams['attributedata'] || !editor.widget.queryParams['attributedata'].length)
      ? []
      : editor.widget.queryParams['attributedata'].split(',')
    ;

    this.setState({ attributes }, this.updateColorScheme);
  };

  updateColorScheme = () => {
    const { editor } = this.props;

    const baseColor = editor.widget.config.markerColor;
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
    const { editor } = this.props;
    const pc = (value - this.minValue) / (this.maxValue - this.minValue);
    return editor.widget.config.markerRadius * (pc + 0.5)
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

  handleMapClick = (e) => {
    //console.log('click');
  };

  handleMapResize = (e) => {
    //console.log('resize');
  };

  handleMapMoveEnd = (e) => {
    //console.log('moveend');
  };

  handleMapLoad = (e) => {
    //console.log('load');
    //this.mapRef.current.leafletElement.invalidateSize();
    //this.timeOut = setTimeout(this.handleMapResize, 0.4)
    //console.log(this.mapRef.current.leafletElement)
  };

  handleRectangleAdd = (e) => {
    //console.log('rectangle added');
    //console.log(this.mapRef.current.leafletElement);
  };

  render() {
    const { classes, editor } = this.props;
    const { loading, error, data, attributes, markerColors, markerOpacity } = this.state;

    if (loading) {
      return <LoadingIndicator />
    }

    const tileLayer = FCC_CONFIG.leafletTileLayers.find((layer) => layer.name === editor.widget.config.tileLayer);

    const rootStyles = {
      width: `${editor.widget.width}px`,
      height: `${editor.widget.height}px`,
      maxWidth: `${editor.widget.width}px`,
      maxHeight: `${editor.widget.height}px`,
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
      <div className={classes.root} style={rootStyles}>
        <Fade in={!loading}>
          <Map
            className={classes.map}
            center={editor.widget.config.center}
            zoom={editor.widget.config.zoom}
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



              {/*{editor.widget.config.showHeatmap &&
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
              }*/}
            </LayersControl>
          </Map>
        </Fade>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  editor: state.editor,
});

MapPreview = withStyles(styles, { withTheme: true })(MapPreview);
MapPreview = connect(mapStateToProps, null)(MapPreview);

export default MapPreview
