import React from 'react';
import PropTypes from 'prop-types';
import {
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  withStyles,
} from '@material-ui/core';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import ColorPicker from 'material-ui-color-picker';
import { connect } from 'react-redux';
import {
  setMapProperty,
  toggleMapTooltipField,
} from '../../../actions/widgetActions';

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: theme.spacing.unit * 20,
  },
  spacer: {
    margin: `${theme.spacing.unit}px 0`,
  },
});

class MapConfig extends React.Component {
  state = {
    tooltipFields: [],
  };

  static propTypes = {
    classes: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    mapConfig: PropTypes.object.isRequired,
    setMapProperty: PropTypes.func.isRequired,
    toggleMapTooltipField: PropTypes.func.isRequired,
  };

  setMapMarkerColor = (color) => {
    this.props.setMapProperty('markerColor', color)
  };

  setMapProperty = (property) => (e) => {
    this.props.setMapProperty(property, e.target.value)
  };

  setMapShowHeatmap = (e) => {
    this.props.setMapProperty('showHeatmap', e.target.checked)
  };

  handleToggleTooltip = (field) => (e) => {
    this.props.toggleMapTooltipField(field, e.target.checked)
  };

  render() {
    const { classes, config, mapConfig } = this.props;

    const dataFields = mapConfig.data.features.length ? Object.keys(mapConfig.data.features[0].properties).map(field => field) : [];

    const menuItems = config.leafletTileLayers.map((tileLayer, i) => {
      return <MenuItem key={i} value={tileLayer.name}>{tileLayer.name}</MenuItem>
    });

    const attributeItems = dataFields.map((field, i) => {
      return <MenuItem key={i} value={field}>{field}</MenuItem>
    });

    const tooltipFields = dataFields.map((field, i) => {
      return (
        <FormControlLabel
          key={i}
          control={
            <Checkbox
              checked={mapConfig.tooltipFields.includes(field)}
              onChange={this.handleToggleTooltip(field)}
              value={field}
              color="primary"
              icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
              checkedIcon={<CheckBoxIcon fontSize="small" />}
            />
          }
          label={field}
        />
      )
    });

    return (
      <FormGroup className={classes.root}>

        <Divider className={classes.spacer} />

        <FormLabel>Tile Layer</FormLabel>
        <FormControl htmlFor="map-tile-layer" className={classes.formControl}>
          <Select
            onChange={this.setMapProperty('tileLayer')}
            value={mapConfig.tileLayer}
            inputProps={{
              name: 'tileLayer',
              id: 'map-tile-layer',
            }}
          >
            {menuItems}
          </Select>
        </FormControl>

        <Divider className={classes.spacer} />

        <FormLabel>Marker</FormLabel>
        <FormControl htmlFor="map-marker-attribute" className={classes.formControl}>
          <InputLabel>Attribute</InputLabel>
          <Select
            onChange={this.setMapProperty('markerAttribute')}
            value={mapConfig.markerAttribute}
            inputProps={{
              name: 'markerAttribute',
              id: 'map-marker-attribute',
            }}
          >
            {attributeItems}
          </Select>
        </FormControl>
        <FormControl htmlFor="map-marker-color" className={classes.formControl}>
          <ColorPicker
            style={{ 'z-index': 3 }}
            label="Color"
            defaultValue='#000'
            value={mapConfig.markerColor}
            onChange={(color) => this.setMapMarkerColor(color)}
            inputProps={{
              name: 'markerColor',
              id: 'map-marker-color',
            }}
          />
        </FormControl>

        <Divider className={classes.spacer} />

        <FormLabel>Heatmap</FormLabel>
        <FormGroup row>
          <FormControlLabel
            label="Enable Heatmap"
            control={
              <Switch
                checked={mapConfig.showHeatmap}
                onChange={this.setMapShowHeatmap}
                value={mapConfig.showHeatmap}
                color="primary"
              />
            }
          />
        </FormGroup>

        <Divider className={classes.spacer} />

        <FormLabel>Tooltip Fields</FormLabel>
        <FormGroup>
          {tooltipFields}
        </FormGroup>

      </FormGroup>
    )
  }
}

const mapStateToProps = state => ({
  config: state.config.config,
  mapConfig: state.widget.mapConfig,
});

const mapDispatchToProps = dispatch => ({
  setMapProperty: (property, value) => dispatch(setMapProperty(property, value)),
  toggleMapTooltipField: (field, checked) => dispatch(toggleMapTooltipField(field, checked)),
});

MapConfig = withStyles(styles)(MapConfig);
MapConfig = connect(mapStateToProps, mapDispatchToProps)(MapConfig);

export default MapConfig
