import {
  PURGE_EDITOR,
  SET_MAP_CAN_MAP,
  SET_MAP_CENTER,
  SET_MAP_DATA,
  SET_MAP_HEATMAP_ATTRIBUTE,
  SET_MAP_SHOW_HEATMAP,
  SET_MAP_TILE_LAYER,
  SET_MAP_ZOOM,
  SET_PLOT_DATA,
  SET_PLOT_DESCRIPTION,
  SET_PLOT_ENCODING,
  SET_PLOT_TYPE,
  SET_WIDGET_NAME,
  SET_WIDGET_TYPE,
} from "./../constants";

const canMap = record => {
  const requiredKeys = ['lat', 'lon'];
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
    const nonNumericColumns = currentState.data.meta.columns.filter(column => !column.numeric);
    const numericColumns = currentState.data.meta.columns.filter(column => column.numeric);
    const nonGeoNumericColumns = numericColumns.filter((column) => !['lat', 'lon'].includes(column.id));

    dispatch({
      type: SET_WIDGET_NAME,
      payload: defaults.widgetName,
    });

    dispatch({
      type: SET_WIDGET_TYPE,
      payload: defaults.widgetType,
    });

    dispatch({
      type: SET_PLOT_TYPE,
      payload: defaults.plotType,
    });

    dispatch({
      type: SET_PLOT_DATA,
      payload: data,
    });

    dispatch({
      type: SET_PLOT_ENCODING,
      payload: {
        axis: "x",
        field: nonNumericColumns[0].id,
        type: "ordinal",
      }
    });

    dispatch({
      type: SET_PLOT_ENCODING,
      payload: {
        axis: "y",
        field: nonGeoNumericColumns[0].id,
        type: "quantitative",
      }
    });

    dispatch({
      type: SET_MAP_TILE_LAYER,
      payload: defaults.mapTileLayer,
    });

    dispatch({
      type: SET_MAP_CAN_MAP,
      payload: canMap(data[0])
    });

    dispatch({
      type: SET_MAP_DATA,
      payload: data,
    });

    dispatch({
      type: SET_MAP_HEATMAP_ATTRIBUTE,
      payload: nonGeoNumericColumns[0].id,
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

export const setMapTileLayer = tileLayer => ({
  type: SET_MAP_TILE_LAYER,
  payload: tileLayer,
});

export const setMapCenter = (lat, lng) => ({
  type: SET_MAP_CENTER,
  payload: { lat, lng },
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

export const setPlotDescription = (desc='') => ({
  type: SET_PLOT_DESCRIPTION,
  payload: desc,
});

export const setPlotEncoding = (enc={}) => ({
  type: SET_PLOT_ENCODING,
  payload: enc,
});

export const setPlotType = type => ({
  type: SET_PLOT_TYPE,
  payload: type,
});

export const setWidgetName = (name='') => ({
  type: SET_WIDGET_NAME,
  payload: name,
});

export const setWidgetType = type => ({
  type: SET_WIDGET_TYPE,
  payload: type,
});
