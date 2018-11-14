import {
  PURGE_EDITOR,
  SET_MAP_TILE_LAYER,
  SET_PLOT_DESCRIPTION,
  SET_PLOT_ENCODING,
  SET_PLOT_TYPE,
  SET_WIDGET_NAME,
  SET_WIDGET_TYPE,
} from "./../constants";

export function initializeEditor() {
  return function(dispatch, getState) {
    const defaults = getState().config.config.widgetEditorDefaults;

    dispatch({
      type: SET_WIDGET_TYPE,
      payload: defaults.widgetType,
    });

    dispatch({
      type: SET_PLOT_TYPE,
      payload: defaults.plotType,
    });

    dispatch({
      type: SET_MAP_TILE_LAYER,
      payload: defaults.tileLayer,
    })
  }
}

export function purgeEditor() {
  return {
    type: PURGE_EDITOR,
  }
}

export function setMapTileLayer(tileLayer) {
  return {
    type: SET_MAP_TILE_LAYER,
    payload: tileLayer,
  }
}

export function setPlotDescription(desc = '') {
  return {
    type: SET_PLOT_DESCRIPTION,
    payload: desc,
  }
}

export function setPlotEncoding(enc = {}) {
  return {
    type: SET_PLOT_ENCODING,
    payload: enc,
  }
}

export function setPlotType(type) {
  return {
    type: SET_PLOT_TYPE,
    payload: type,
  }
}

export function setWidgetName(name = '') {
  return {
    type: SET_WIDGET_NAME,
    payload: name,
  }
}

export function setWidgetType(type) {
  return {
    type: SET_WIDGET_TYPE,
    payload: type,
  }
}
