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
export const fetchAdmin = () => {
  return (dispatch, getState) => {
    const currentState = getState();
    const config = currentState.config.config;

    dispatch({
      type: FETCH_ADMIN,
    });

    axios({
      url: config.apiRoot + 'admin/list_users',
      method: 'post',
      headers: {
        Authorization: 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NTA1MDUzNTgsIm5iZiI6MTU1MDUwNTM1OCwianRpIjoiZDA4ZGRiNGQtNDE4YS00YWMwLWFkODYtZDQ3ZGM0ZTUyYTQ4IiwiZXhwIjoxNTUxMTEwMTU4LCJpZGVudGl0eSI6InBhdHJpY2tAZG90bW9kdXMuY29tIiwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIiwidXNlcl9jbGFpbXMiOnsiYWRtaW4iOm51bGx9fQ.N_fD7BGjnRL47YFoclmIBnoWzub2ugDJUSNuLwRA0B4'
      },
      data: {
        limit: '10'
      },
    })
      .then((response) => {
        dispatch({
          type: FETCH_ADMIN_FULFILLED,
          payload: response.data,
        })
      })
      .catch((err) => {
        dispatch({
          type: FETCH_ADMIN_REJECTED,
          payload: err,
        })
      })
  };
};

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
export const fetchAttributeData = (themeId, subthemeId, queryParams = {}) => {
  return (dispatch, getState) => {
    const currentState = getState();
    const config = currentState.config.config;
    const themes = currentState.api.themes;

    // gather all selected attributes
    const selectedAttributes = themes.find((theme) => theme.id === themeId)
      .subthemes.find((subtheme) => subtheme.id === subthemeId)
      .attributes.filter((attr) => attr.isSelected)
      .map((attr) => attr.name)
    ;

    // catch no attributes selected
    if (!selectedAttributes.length) {
      dispatch({
        type: FETCH_ATTRIBUTE_DATA_FULFILLED,
        payload: {
          themeId,
          subthemeId,
          queryParams: {
            ...queryParams,
            attributedata: selectedAttributes.join(),
          },
          data: [],
        },
      });

      return
    }

    dispatch({
      type: FETCH_ATTRIBUTE_DATA,
    });

    axios({
      url: config.apiRoot + 'data',
      method: 'get',
      params: {
        ...queryParams,
        attributedata: selectedAttributes.join(),
      },
    })
      .then((response) => {
        dispatch({
          type: FETCH_ATTRIBUTE_DATA_FULFILLED,
          payload: {
            themeId,
            subthemeId,
            queryParams: {
              ...queryParams,
              attributedata: selectedAttributes.join(),
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
