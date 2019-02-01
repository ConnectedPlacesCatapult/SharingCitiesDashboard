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
import Slider from '@material-ui/lab/Slider';
import Typography from '@material-ui/core/Typography';

// color picker
import ColorPicker from 'material-ui-color-picker';

// redux
import { connect } from 'react-redux';
import {
  setMapMarkerAttribute,
  setMapMarkerColor,
  setMapMarkerOpacity,
  setMapShowHeatmap,
  setMapTileLayer,
  toggleMapTooltipField,
} from "../../../actions/editorActions";

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
  slider: {
    padding: '22px 0px',
  },
  sliderLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    padding: 0,
    fontSize: '1rem',
    lineHeight: 1,
    transform: 'translate(0, 1.5px) scale(0.75)',
    transformOrigin: 'top left',
  },
});

class MapConfig extends React.Component {
  state = {
    tooltipFields: [],
  };

  dataFields = Object.keys(this.props.data.data[0]).map(field => {
    return field
  });

  setMapMarkerAttribute = (e) => {
    this.props.setMapMarkerAttribute(e.target.value)
  };

  setMapMarkerColor = (color) => {
    this.props.setMapMarkerColor(color)
  };

  setMapMarkerOpacity = (e, value) => {
    this.props.setMapMarkerOpacity(value);
  };

  setMapShowHeatmap = (e) => {
    this.props.setMapShowHeatmap(e.target.checked)
  };

  setMapTileLayer = (e) => {
    this.props.setMapTileLayer(e.target.value)
  };

  handleToggleTooltip = (field) => (e) => {
    this.props.toggleMapTooltipField(field, e.target.checked)
  };

  render() {
    const { classes, config, editor } = this.props;

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
              checked={editor.tooltipFields.includes(field)}
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
            onChange={this.setMapTileLayer}
            value={editor.tileLayer}
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
            onChange={this.setMapMarkerAttribute}
            value={editor.markerAttribute}
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
            value={editor.markerColor}
            onChange={(color) => this.setMapMarkerColor(color)}
            inputProps={{
              name: 'markerColor',
              id: 'map-marker-color',
            }}
          />
        </FormControl>
        <FormControl htmlFor="map-marker-opacity" className={classes.formControl}>
          <Typography
            id="markerOpacityLabel"
            component='label'
            className={classes.sliderLabel}
          >
            Opacity
          </Typography>
          <Slider
            classes={{ container: classes.slider }}
            aria-labelledby="markerOpacityLabel"
            value={editor.markerOpacity}
            onChange={this.setMapMarkerOpacity}
            min={0}
            max={1}
          />
        </FormControl>

        <Divider className={classes.spacer} />

        <FormLabel>Heatmap</FormLabel>
        <FormGroup row>
          <FormControlLabel
            label="Enable Heatmap"
            control={
              <Switch
                checked={editor.showHeatmap}
                onChange={this.setMapShowHeatmap}
                value={editor.showHeatmap}
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
  data: PropTypes.object.isRequired,
  editor: PropTypes.object.isRequired,
  setMapMarkerAttribute: PropTypes.func.isRequired,
  setMapMarkerColor: PropTypes.func.isRequired,
  setMapMarkerOpacity: PropTypes.func.isRequired,
  setMapShowHeatmap: PropTypes.func.isRequired,
  setMapTileLayer: PropTypes.func.isRequired,
  toggleMapTooltipField: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  config: state.config.config,
  data: state.data,
  editor: state.editor.mapConfig,
});

const mapDispatchToProps = dispatch => ({
  setMapMarkerAttribute: (attr) => dispatch(setMapMarkerAttribute(attr)),
  setMapMarkerColor: (color) => dispatch(setMapMarkerColor(color)),
  setMapMarkerOpacity: (opacity) => dispatch(setMapMarkerOpacity(opacity)),
  setMapShowHeatmap: (showHeatmap) => dispatch(setMapShowHeatmap(showHeatmap)),
  setMapTileLayer: (tileLayer) => dispatch(setMapTileLayer(tileLayer)),
  toggleMapTooltipField: (field, checked) => dispatch(toggleMapTooltipField(field, checked)),
});

MapConfig = withStyles(styles)(MapConfig);
MapConfig = connect(mapStateToProps, mapDispatchToProps)(MapConfig);

export default MapConfig
