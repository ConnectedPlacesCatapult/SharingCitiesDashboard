import {
  EDITOR_CLOSE,
  EDITOR_OPEN,
  EDITOR_SET_WIDGET_PROPERTY,
  EDITOR_SET_WIDGET_CONFIG_PROPERTY,
  EDITOR_SET_WIDGET_QUERY_PROPERTY,
} from "../constants";

export const closeEditor = () => ({
  type: EDITOR_CLOSE,
});

export const openEditor = (mode, widgetProperties=null) => ({
  type: EDITOR_OPEN,
  payload: {
    mode,
    widgetProperties,
  },
});

export const setWidgetProperty = (property, value) => ({
  type: EDITOR_SET_WIDGET_PROPERTY,
  payload: {
    property,
    value,
  },
});

export const setWidgetConfigProperty = (property, value) => ({
  type: EDITOR_SET_WIDGET_CONFIG_PROPERTY,
  payload: {
    property,
    value,
  },
});

export const setWidgetQueryProperty = (property, value) => ({
  type: EDITOR_SET_WIDGET_QUERY_PROPERTY,
  payload: {
    property,
    value,
  },
});
