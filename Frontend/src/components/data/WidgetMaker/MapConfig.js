import React from 'react';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from '@material-ui/core/Divider';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { connect } from 'react-redux';
import {
  setMapHeatmapAttribute,
  setMapShowHeatmap,
  setMapTileLayer
} from "../../../actions/editorActions";
import InputLabel from "@material-ui/core/InputLabel";

const styles = theme => ({
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
  setMapTileLayer = e => {
    this.props.setMapTileLayer(e.target.value)
  };

  setMapShowHeatmap = e => {
    this.props.setMapShowHeatmap(e.target.checked)
  };

  setMapHeatmapAttribute = e => {
    this.props.setMapHeatmapAttribute(e.target.value)
  };



  render() {
    const { classes, config, editor, meta } = this.props;

    const nonNumericColumns = meta.columns.filter(column => !column.numeric);
    const numericColumns = meta.columns.filter(column => column.numeric);
    const nonGeoNumericColumns = numericColumns.filter((column) => !['lat', 'lon'].includes(column.id));

    const menuItems = config.leafletTileLayers.map((tileLayer, i) => {
      return <MenuItem key={i} value={tileLayer.name}>{tileLayer.name}</MenuItem>
    });

    const attributeItems = nonGeoNumericColumns.map((column, i) => {
      return <MenuItem key={i} value={column.id}>{column.label}</MenuItem>
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
  editor: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  setMapHeatmapAttribute: PropTypes.func.isRequired,
  setMapShowHeatmap: PropTypes.func.isRequired,
  setMapTileLayer: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  config: state.config.config,
  editor: state.editor.mapConfig,
  meta: state.data.meta,
});

const mapDispatchToProps = dispatch => ({
  setMapHeatmapAttribute: attr => dispatch(setMapHeatmapAttribute(attr)),
  setMapShowHeatmap: showHeatmap => dispatch(setMapShowHeatmap(showHeatmap)),
  setMapTileLayer: tileLayer => dispatch(setMapTileLayer(tileLayer)),
});

MapConfig = withStyles(styles)(MapConfig);

export default connect(mapStateToProps, mapDispatchToProps)(MapConfig)
