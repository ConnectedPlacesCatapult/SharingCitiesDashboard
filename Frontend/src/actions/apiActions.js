import axios from "axios";
import {
  FETCH_THEMES,
  FETCH_THEMES_FULFILLED,
  FETCH_THEMES_REJECTED,
  FETCH_ADMIN,
  FETCH_ADMIN_FULFILLED,
  FETCH_ADMIN_REJECTED,
  TOGGLE_THEME_SELECTED,
  FETCH_SUBTHEMES,
  FETCH_SUBTHEMES_FULFILLED,
  FETCH_SUBTHEMES_REJECTED,
  TOGGLE_SUBTHEME_SELECTED,
  FETCH_ATTRIBUTES,
  FETCH_ATTRIBUTES_FULFILLED,
  FETCH_ATTRIBUTES_REJECTED,
  TOGGLE_ATTRIBUTE_SELECTED,
  FETCH_ATTRIBUTE_DATA,
  FETCH_ATTRIBUTE_DATA_FULFILLED,
  FETCH_ATTRIBUTE_DATA_REJECTED,
  REMOVE_ATTRIBUTE_DATA,
  QUERY_PARAMS,
} from "./../constants";

// Themes
export const fetchThemes = () => {
  return (dispatch, getState) => {
    const currentState = getState();
    const config = currentState.config.config;

    dispatch({
      type: FETCH_THEMES,
    });

    axios({
      url: config.apiRoot + 'data',
      method: 'get',
      params: {},
    })
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
  return (dispatch, getState) => {
    const currentState = getState();
    const config = currentState.config.config;

    dispatch({
      type: FETCH_SUBTHEMES,
    });

    axios({
      url: config.apiRoot + 'data',
      method: 'get',
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
  return (dispatch, getState) => {
    const currentState = getState();
    const config = currentState.config.config;

    dispatch({
      type: FETCH_ATTRIBUTES,
    });

    axios({
      url: config.apiRoot + 'data',
      method: 'get',
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
  return (dispatch, getState) => {
    const currentState = getState();
    const config = currentState.config.config;

    dispatch({
      type: FETCH_ATTRIBUTE_DATA,
    });

    axios({
      url: config.apiRoot + 'data',
      method: 'get',
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
