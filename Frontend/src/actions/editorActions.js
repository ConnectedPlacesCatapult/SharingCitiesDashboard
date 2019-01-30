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

export const setWidgetType = (type) => ({
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
