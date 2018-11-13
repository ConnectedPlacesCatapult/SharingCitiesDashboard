import {
  PURGE_EDITOR,
  SET_PLOT_TYPE,
  SET_WIDGET_TYPE,
  WIDGET_TYPE_MAP,
  WIDGET_TYPE_PLOT,
} from "./types";

export function purgeEditor() {
  return {
    type: PURGE_EDITOR,
  }
}

export function setPlotType(type) {
  return {
    type: SET_PLOT_TYPE,
    payload: type,
  }
}

export function setWidgetType(type) {
  return {
    type: SET_WIDGET_TYPE,
    payload: type,
  }
}
