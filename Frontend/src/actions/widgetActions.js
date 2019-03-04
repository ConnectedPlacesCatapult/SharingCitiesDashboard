import axios from "axios";
import { axiosInstance } from '../api/axios'

import _ from 'lodash'
import {
  DATA_FORMAT_OTHER,
  DATA_FORMAT_RAW,
  DATA_FORMAT_WIDE,
  PURGE_EDITOR,
  SET_DATA_FORMAT,
  SET_MAP_DATA,
  SET_MAP_PROPERTY,
  SET_PLOT_DATA,
  SET_PLOT_ENCODING,
  SET_PLOT_PROPERTY,
  SET_WIDGET_PROPERTY,
  SAVE_WIDGET_FULFILLED,
  SAVE_WIDGET_REJECTED,
  HIDE_NOTIFICATION,
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

export const convertWideToRaw = (wideData) => {
  return (dispatch, getState) => {
    const currentState = getState();

    const fields = ['Latitude', 'Longitude', 'Value', 'Timestamp'];
    const numAttributes = wideData.length ? Object.keys(wideData[0]).length / fields.length : 0;
    const selectedAttributes = Object.keys(wideData[0]).slice(0, numAttributes).map((key) => key.substring(fields[0].length + 1));

    const formattedData = wideData.map((record) => {
      return selectedAttributes.map((attr) => {
        const initialValue = {
          Attribute_Name: attr,
          Attribute_id: "fake-data",
          Name: "fake-data",
          Sensor_id: "fake-data",
        };

        return fields.reduce((newRecord, key) => {
          newRecord = {
            ...newRecord,
            [key]: record[`${key},${attr}`] === null ? "null" : record[`${key},${attr}`],
          };

          return newRecord
        }, initialValue)
      })
    }).flat().sort((a, b) => {
      if (a['Attribute_Name'] < b['Attribute_Name']) return -1;
      if (a['Attribute_Name'] > b['Attribute_Name']) return 1;
      return 0
    });

    return formattedData;
  }
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

    // ToDo :: Sort this out using dataFormat and state data
    dispatch({
      type: SET_WIDGET_PROPERTY,
      payload: {
        property: 'isMappable',
        //value: isMappable(data[0]),
        value: true,
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
        property: 'rawData',
        value: data,
      }
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

export const setDataFormat = (format) => ({
  type: SET_DATA_FORMAT,
  payload: format,
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

// Save Widget
export const saveWidget = () => {
  return (dispatch, getState) => {
    const currentState = getState();

    const widgetConfig = _.get(currentState, 'widget' )

    const requestData = {
      data: widgetConfig,
    }

    axiosInstance.post('widgets/create_widget', requestData).then((response) => {
      dispatch({
        type: SAVE_WIDGET_FULFILLED,
        payload: response.data,
      })
      setTimeout(() => {
        dispatch({
          type: HIDE_NOTIFICATION,
        })
      }, 2000)
    })
      .catch((error) => {
        dispatch({
          type: SAVE_WIDGET_REJECTED,
          payload: error.statusText,
        })
      })
      setTimeout(() => {
      dispatch({
        type: HIDE_NOTIFICATION,
      })
    }, 5000)
  };
};