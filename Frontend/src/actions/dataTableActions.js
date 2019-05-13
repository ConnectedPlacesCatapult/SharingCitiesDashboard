import {
  FETCH_ATTRIBUTE_DATA,
  FETCH_ATTRIBUTE_DATA_FULFILLED,
  FETCH_ATTRIBUTE_DATA_REJECTED,
  FETCH_ATTRIBUTES,
  FETCH_ATTRIBUTES_FULFILLED,
  FETCH_ATTRIBUTES_REJECTED,
  FETCH_SUBTHEMES,
  FETCH_SUBTHEMES_FULFILLED,
  FETCH_SUBTHEMES_REJECTED,
  FETCH_THEMES,
  FETCH_THEMES_FULFILLED,
  FETCH_THEMES_REJECTED,
  QUERY_PARAMS,
  REMOVE_ATTRIBUTE_DATA,
  RESET_STATE,
  SET_ACTIVE_TAB_ATTRIBUTE,
  TOGGLE_ATTRIBUTE_SELECTED,
  TOGGLE_SUBTHEME_SELECTED,
  TOGGLE_THEME_SELECTED,
  EXPORT_DATA,
  EXPORT_DATA_FULFILLED,
  EXPORT_DATA_REJECTED
} from './../constants';

import fileDownload from 'js-file-download';
import { axiosInstance } from './../api/axios';

// Themes
export const fetchThemes = () => {
  return (dispatch) => {
    dispatch({
      type: FETCH_THEMES,
    });

    axiosInstance
      .get('/data')
      .then((response) => {
        dispatch({
          type: FETCH_THEMES_FULFILLED,
          payload: response.data,
        })
      })
      .catch((err) => {
        dispatch({
          type: FETCH_THEMES_REJECTED,
          payload: err,
        })
      })
  };
};

// Admin
export const toggleThemeSelected = (themeId) => ({
  type: TOGGLE_THEME_SELECTED,
  payload: themeId,
});

// Subthemes
export const fetchSubthemes = (themeId) => {
  return (dispatch) => {
    dispatch({
      type: FETCH_SUBTHEMES,
    });

    axiosInstance
      .get('/data', {
        params: {
          [QUERY_PARAMS.THEME_ID]: themeId,
        },
      })
      .then((response) => {
        dispatch({
          type: FETCH_SUBTHEMES_FULFILLED,
          payload: {
            themeId,
            subthemes: response.data,
          },
        })
      })
      .catch((err) => {
        dispatch({
          type: FETCH_SUBTHEMES_REJECTED,
          payload: err,
        })
      })
  }
};

export const toggleSubthemeSelected = (themeId, subthemeId) => ({
  type: TOGGLE_SUBTHEME_SELECTED,
  payload: {
    themeId,
    subthemeId,
  },
});

// Attributes
export const fetchAttributes = (themeId, subthemeId) => {
  return (dispatch) => {
    dispatch({
      type: FETCH_ATTRIBUTES,
    });

    axiosInstance
      .get('/data', {
        params: {
          [QUERY_PARAMS.SUBTHEME_ID]: subthemeId,
        },
      })
      .then((response) => {
        dispatch({
          type: FETCH_ATTRIBUTES_FULFILLED,
          payload: {
            themeId,
            subthemeId,
            attributes: response.data,
          },
        })
      })
      .catch((err) => {
        dispatch({
          type: FETCH_ATTRIBUTES_REJECTED,
          payload: err,
        })
      })
  }
};

export const toggleAttributeSelected = (themeId, subthemeId, attributeId) => ({
  type: TOGGLE_ATTRIBUTE_SELECTED,
  payload: {
    themeId,
    subthemeId,
    attributeId,
  },
});

// data
export const fetchAttributeData = (attributeName, queryParams = {}) => {
  return (dispatch) => {
    dispatch({
      type: FETCH_ATTRIBUTE_DATA,
    });

    axiosInstance
      .get('/data', {
        params: {
          ...queryParams,
          ['attributedata']: attributeName,
        },
      })
      .then((response) => {
        dispatch({
          type: FETCH_ATTRIBUTE_DATA_FULFILLED,
          payload: {
            queryParams: {
              ...queryParams,
              attributedata: attributeName,
            },
            data: response.data,
          },
        })
      })
      .catch((err) => {
        dispatch({
          type: FETCH_ATTRIBUTE_DATA_REJECTED,
          payload: err,
        })
      })
  }
};

export const removeAttributeData = (attributeId) => ({
  type: REMOVE_ATTRIBUTE_DATA,
  payload: attributeId,
});

//export
/*export const exportData = (tableName) => {

  var fileDownload = require('js-file-download');
  var json2csv = require('json2csv');

  return (dispatch) => {
    dispatch({
      type: EXPORT_DATA,
    });

    const requestData = {
      "file_name": `export-${tableName}`,
      "table_name": tableName,
      "format": "geojson"
    };

    axiosInstance
      .post('/export_data', requestData)
      .then((response) => {

        console.log('response.data', response.data.features)

        const fields = ["id", "type", "geometry.type"]

        const features = json2csv.parse(response.data.features, {fields})

        fileDownload(features, 'report.csv');

        dispatch({
          type: EXPORT_DATA_FULFILLED,
          payload: response.data,
        })
      })
      .catch((error) => {
        dispatch({
          type: EXPORT_DATA_REJECTED,
          payload: error,
        })
      })
  }
};*/

export const exportDataByFormat = (format) => {
  return (dispatch, getState) => {
    const currentState = getState();
    const selectedAttribute = (currentState.dataTable.activeTabAttribute) ? currentState.dataTable.activeTabAttribute : {
      id: currentState.dataTable.data[0]['Attribute_id'],
      name: currentState.dataTable.data[0]['Attribute_Name'],
      table: currentState.dataTable.data[0]['Attribute_Table'],
    };

    dispatch({
      type: EXPORT_DATA,
    });

    const requestData = {
      file_name: `${selectedAttribute.name}-${Date.now()}.${format}`,
      table_name: selectedAttribute.table,
      format: format,
      //directory: '',
      //limit: 100,
    };

    axiosInstance
      .post('/export_data', requestData)
      .then((response) => {

        switch(format) {
          case 'csv':
            fileDownload(response.data, requestData.file_name);

            break;

          default:
          case 'geojson':
          case 'json':
            fileDownload(JSON.stringify(response.data), requestData.file_name);

            break;
        }

        dispatch({
          type: EXPORT_DATA_FULFILLED,
          payload: response.data,
        })
      })
      .catch((error) => {
        dispatch({
          type: EXPORT_DATA_REJECTED,
          payload: error,
        })
      })
  }
};

// ToDo :: this needs to be called once before any tab is clicked
export const setActiveTabAttribute = (id, name, table) => {
  return (dispatch) => {
    dispatch({
      type: SET_ACTIVE_TAB_ATTRIBUTE,
      payload: {
        id,
        name,
        table,
      },
    })
  }
};
