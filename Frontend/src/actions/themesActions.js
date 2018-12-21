import axios from "axios";
import {
  FETCH_THEMES,
  FETCH_THEMES_FULFILLED,
  FETCH_THEMES_REJECTED,
  TOGGLE_THEME_SELECTED,
  FETCH_SUBTHEMES,
  FETCH_SUBTHEMES_FULFILLED,
  FETCH_SUBTHEMES_REJECTED,
  TOGGLE_SUBTHEME_SELECTED,
  FETCH_ATTRIBUTES,
  FETCH_ATTRIBUTES_FULFILLED,
  FETCH_ATTRIBUTES_REJECTED,
  TOGGLE_ATTRIBUTE_SELECTED,
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
      url: config.apiRoot,
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

export const toggleThemeSelected = themeId => ({
  type: TOGGLE_THEME_SELECTED,
  payload: themeId,
});

// Subthemes
export const fetchSubthemes = themeId => {
  return (dispatch, getState) => {
    const currentState = getState();
    const config = currentState.config.config;

    dispatch({
      type: FETCH_SUBTHEMES,
    });

    axios({
      url: config.apiRoot,
      method: 'get',
      params: {
        theme: themeId,
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
  payload: { themeId, subthemeId },
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
      url: config.apiRoot,
      method: 'get',
      params: {
        subtheme: subthemeId,
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
  payload: { themeId, subthemeId, attributeId },
});
