import React from 'react';
import PropTypes from "prop-types";

// material-ui
import { withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from '@material-ui/core/Divider';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import InputLabel from "@material-ui/core/InputLabel";
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

// color picker
import ColorPicker from 'material-ui-color-picker';

// redux
import { connect } from 'react-redux';
import {
  setMapProperty,
  toggleMapTooltipField,
} from "../../../actions/widgetActions";

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

  dataFields = Object.keys(this.props.data[0]).map(field => {
    return field
  });

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

    const menuItems = config.leafletTileLayers.map((tileLayer, i) => {
      return <MenuItem key={i} value={tileLayer.name}>{tileLayer.name}</MenuItem>
    });

    const attributeItems = this.dataFields.map((field, i) => {
      return <MenuItem key={i} value={field}>{field}</MenuItem>
    });

    const tooltipFields = this.dataFields.map((field, i) => {
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

MapConfig.propTypes = {
  classes: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  mapConfig: PropTypes.object.isRequired,
  setMapProperty: PropTypes.func.isRequired,
  toggleMapTooltipField: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  config: state.config.config,
  data: state.api.data,
  mapConfig: state.widget.mapConfig,
});

const mapDispatchToProps = dispatch => ({
  setMapProperty: (property, value) => dispatch(setMapProperty(property, value)),
  toggleMapTooltipField: (field, checked) => dispatch(toggleMapTooltipField(field, checked)),
});

MapConfig = withStyles(styles)(MapConfig);
MapConfig = connect(mapStateToProps, mapDispatchToProps)(MapConfig);

export default MapConfig
