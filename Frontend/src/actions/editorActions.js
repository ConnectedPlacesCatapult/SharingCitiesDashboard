import {
  PURGE_EDITOR,
  SET_WIDGET_NAME,
  SET_WIDGET_TYPE,
  SET_PLOT_DATA,
  SET_PLOT_PROPERTY,
  SET_PLOT_ENCODING,
  SET_MAP_CENTER,
  SET_MAP_DATA,
  SET_MAP_HEATMAP_ATTRIBUTE,
  SET_MAP_IS_MAPPABLE,
  SET_MAP_SHOW_HEATMAP,
  SET_MAP_TILE_LAYER,
  SET_MAP_ZOOM,
} from "./../constants";

const isMappable = record => {
  const requiredKeys = ['Latitude', 'Longitude'];
  const presentKeys = Object.keys(record);

  for (let rk of requiredKeys) {
    if (!presentKeys.includes(rk)) return false;
  }

  return true
};

/**
 * {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [-105.00341892242432, 39.75383843460583],
                    [-105.0008225440979, 39.751891803969535]
                ]
            },
            "properties": {
                "popupContent": "This is a free bus line that will take you across downtown.",
                "underConstruction": false
            },
            "id": 1
        }
 * @param data
 *
 *
 *
 *
 *
 *
 *
 * {
  "Timestamp": 1543795200000,
  "Attribute_Name": "SO2",
  "Sensor_id": "3004cb8a-2e0d-4d7c-b4ac-5985d83418c1",
  "Value": 6.5,
  "Name": "LB5",
  "Latitude": 51.485486774,
  "Longitude": -0.1245452348
}
 */

const convertToFeatureList = (data) => {
  return data.map((record, i) => {
    const otherKeys = Object.keys(record).filter(key => !["Latitude", "Longitude"].includes(key));
    const otherProperties = otherKeys.map((prop) => {
      return {
        [prop]: record[prop]
      }
    });

    return {
      type: "feature",
      id: i,
      geometry: {
        type: "Point",
        coordinates: [record["Longitude"], record["Latitude"]],
      },
      properties: {
        ...otherProperties,
      },
    }
  })
};

// ToDo :: this needs to remember stuff rather than just overwrite it every time
export const initializeEditor = () => {
  return (dispatch, getState) => {
    const currentState = getState();
    const defaults = currentState.config.config.widgetEditorDefaults;
    const data = currentState.data.data;

    dispatch({
      type: SET_WIDGET_NAME,
      payload: defaults.widgetName,
    });

    dispatch({
      type: SET_WIDGET_TYPE,
      payload: defaults.widgetType,
    });

    dispatch({
      type: SET_PLOT_DATA,
      payload: data,
    });

    dispatch({
      type: SET_MAP_TILE_LAYER,
      payload: defaults.mapTileLayer,
    });

    dispatch({
      type: SET_MAP_IS_MAPPABLE,
      payload: isMappable(data[0])
    });

    dispatch({
      type: SET_MAP_DATA,
      payload: data,
    });

    dispatch({
      type: SET_MAP_HEATMAP_ATTRIBUTE,
      payload: "Value",
    });

    dispatch({
      type: SET_MAP_SHOW_HEATMAP,
      payload: defaults.mapShowHeatmap,
    });

    dispatch({
      type: SET_MAP_ZOOM,
      payload: defaults.mapZoom,
    });

    dispatch({
      type: SET_MAP_CENTER,
      payload: defaults.mapCenter,
    });
  }
};

export const purgeEditor = () => ({
  type: PURGE_EDITOR,
});

export const setWidgetName = (name='') => ({
  type: SET_WIDGET_NAME,
  payload: name,
});

export const setWidgetType = type => ({
  type: SET_WIDGET_TYPE,
  payload: type,
});

export const setPlotData = (data=[]) => ({
  type: SET_PLOT_DATA,
  payload: data,
});

export const setPlotProperty = (property, value) => ({
  type: SET_PLOT_PROPERTY,
  payload: {
    property,
    value,
  },
});

export const setPlotEncoding = (encoding) => ({
  type: SET_PLOT_ENCODING,
  payload: encoding,
});

export const setMapIsMappable = isMappable => ({
  type: SET_MAP_IS_MAPPABLE,
  payload: isMappable,
});

export const setMapTileLayer = tileLayer => ({
  type: SET_MAP_TILE_LAYER,
  payload: tileLayer,
});

export const setMapCenter = (center) => ({
  type: SET_MAP_CENTER,
  payload: center,
});

export const setMapHeatmapAttribute = attr => ({
  type: SET_MAP_HEATMAP_ATTRIBUTE,
  payload: attr,
});

export const setMapShowHeatmap = showHeatmap => ({
  type: SET_MAP_SHOW_HEATMAP,
  payload: showHeatmap,
});

export const setMapZoom = zoom => ({
  type: SET_MAP_ZOOM,
  payload: zoom,
});
