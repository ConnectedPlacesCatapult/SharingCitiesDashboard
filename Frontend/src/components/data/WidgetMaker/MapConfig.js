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

// redux
import { connect } from 'react-redux';
import {
  setMapHeatmapAttribute,
  setMapShowHeatmap,
  setMapTileLayer
} from "../../../actions/editorActions";

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  formLabel: {

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
  setMapTileLayer = (e) => {
    this.props.setMapTileLayer(e.target.value)
  };

  setMapShowHeatmap = (e) => {
    this.props.setMapShowHeatmap(e.target.checked)
  };

  setMapHeatmapAttribute = (e) => {
    this.props.setMapHeatmapAttribute(e.target.value)
  };

  render() {
    const { classes, config, data, editor } = this.props;

    const menuItems = config.leafletTileLayers.map((tileLayer, i) => {
      return <MenuItem key={i} value={tileLayer.name}>{tileLayer.name}</MenuItem>
    });

    const attributeItems = Object.keys(data.data[0]).map((field, i) => {
      return <MenuItem key={i} value={field}>{field}</MenuItem>
    });

    return (
      <FormGroup className={classes.root}>

        <Divider className={classes.spacer} />

        <FormLabel className={classes.formLabel}>Map Tile Layer</FormLabel>
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

        <FormLabel className={classes.formLabel}>Heatmap</FormLabel>
        <FormGroup row>
          <FormControlLabel
            label="Enable Heatmap"
            //labelPlacement="start"
            control={
              <Switch
                checked={editor.showHeatmap}
                onChange={this.setMapShowHeatmap}
                value={editor.showHeatmap}
              />
            }
          />
        </FormGroup>
        <FormControl htmlFor="map-heatmap-attribute" className={classes.formControl}>
          <InputLabel>Heatmap attribute</InputLabel>
          <Select
            onChange={this.setMapHeatmapAttribute}
            value={editor.heatmapAttribute}
            inputProps={{
              name: 'heatmapAttribute',
              id: 'map-heatmap-attribute',
            }}
          >
            {attributeItems}
          </Select>
        </FormControl>

      </FormGroup>
    )
  }
}

MapConfig.propTypes = {
  classes: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  editor: PropTypes.object.isRequired,
  setMapHeatmapAttribute: PropTypes.func.isRequired,
  setMapShowHeatmap: PropTypes.func.isRequired,
  setMapTileLayer: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  config: state.config.config,
  data: state.data,
  editor: state.editor.mapConfig,
});

const mapDispatchToProps = dispatch => ({
  setMapHeatmapAttribute: (attr) => dispatch(setMapHeatmapAttribute(attr)),
  setMapShowHeatmap: (showHeatmap) => dispatch(setMapShowHeatmap(showHeatmap)),
  setMapTileLayer: (tileLayer) => dispatch(setMapTileLayer(tileLayer)),
});

MapConfig = withStyles(styles)(MapConfig);
MapConfig = connect(mapStateToProps, mapDispatchToProps)(MapConfig);

export default MapConfig
