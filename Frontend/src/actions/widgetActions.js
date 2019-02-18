import _ from 'lodash'
import {
  PURGE_EDITOR,
  SET_MAP_DATA,
  SET_MAP_PROPERTY,
  SET_PLOT_DATA,
  SET_PLOT_ENCODING,
  SET_PLOT_PROPERTY,
  SET_WIDGET_PROPERTY,
  TOGGLE_MAP_TOOLTIP_FIELD,
} from "./../constants";

/**
 * Simply returns true if a record object contains both "Latitude" and "Longitude" fields
 *
 * @param record
 * @returns {boolean}
 */
const isMappable = (record={}) => {
  const requiredKeys = ['Latitude', 'Longitude'];
  const presentKeys = Object.keys(record);

  for (let rk of requiredKeys) {
    if (!presentKeys.includes(rk)) return false;
  }

  return true
};

/**
 * Applies default values as defined in ./../../fcc.config.js
 *
 * @returns {Function}
 */
export const initializeEditor = () => {
  return (dispatch, getState) => {
    const currentState = getState();
    const defaults = currentState.config.config.widgetEditorDefaults;
    const data = currentState.api.data;

    dispatch({
      type: SET_MAP_DATA,
      payload: data,
    });

    dispatch({
      type: SET_MAP_PROPERTY,
      payload: {
        property: 'center',
        value: defaults.mapCenter,
      },
    });

    dispatch({
      type: SET_MAP_PROPERTY,
      payload: {
        property: 'markerAttribute',
        value: defaults.mapMarkerAttribute,
      },
    });

    dispatch({
      type: SET_MAP_PROPERTY,
      payload: {
        property: 'markerColor',
        value: defaults.mapMarkerColor,
      },
    });

    dispatch({
      type: SET_MAP_PROPERTY,
      payload: {
        property: 'markerRadius',
        value: defaults.mapMarkerRadius,
      },
    });

    dispatch({
      type: SET_MAP_PROPERTY,
      payload: {
        property: 'tileLayer',
        value: defaults.mapTileLayer,
      },
    });

    dispatch({
      type: SET_MAP_PROPERTY,
      payload: {
        property: 'showHeatmap',
        value: defaults.mapShowHeatmap,
      },
    });

    dispatch({
      type: SET_MAP_PROPERTY,
      payload: {
        property: 'zoom',
        value: defaults.mapZoom,
      },
    });

    dispatch({
      type: SET_PLOT_DATA,
      payload: data,
    });

    dispatch({
      type: SET_PLOT_PROPERTY,
      payload: {
        property: "mark",
        value: defaults.plotMarker,
      },
    });

    dispatch({
      type: SET_WIDGET_PROPERTY,
      payload: {
        property: 'isMappable',
        value: isMappable(data[0]),
      },
    });

    dispatch({
      type: SET_WIDGET_PROPERTY,
      payload: {
        property: 'name',
        value: defaults.widgetName,
      },
    });

    dispatch({
      type: SET_WIDGET_PROPERTY,
      payload: {
        property: 'type',
        value: defaults.widgetType,
      },
    });
  }
};

export const purgeEditor = () => ({
  type: PURGE_EDITOR,
});

export const setMapData = (data=[]) => ({
  type: SET_MAP_DATA,
  payload: data,
});

export const setMapProperty = (property, value) => ({
  type: SET_MAP_PROPERTY,
  payload: {
    property,
    value,
  },
});

export const setPlotData = (data=[]) => ({
  type: SET_PLOT_DATA,
  payload: data,
});

export const setPlotEncoding = (encoding) => ({
  type: SET_PLOT_ENCODING,
  payload: encoding,
});

export const setPlotProperty = (property, value) => ({
  type: SET_PLOT_PROPERTY,
  payload: {
    property,
    value,
  },
});

export const setWidgetProperty = (property, value) => ({
  type: SET_WIDGET_PROPERTY,
  payload: {
    property,
    value,
  },
});

export const toggleMapTooltipField = (field, checked) => ({
  type: TOGGLE_MAP_TOOLTIP_FIELD,
  payload: {
    field,
    checked,
  },
});

export function saveWidget() {
  return (dispatch, getState) => {
    console.log(getState())
    const state = getState()
    const widgetType = _.get(state, 'widget.type')
    let config = null
    if (widgetType === 'plot') {
      config = _.get(state, 'widget.plotConfig' )
    } else if (widgetType === 'map') {
      config = _.get(state, 'widget.mapConfig' )
    } else {
      config = _.get(state, 'widget.alertConfig' )
    }
    console.log(config)
  }
}
