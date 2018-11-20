//import axios from "axios";
import {
  FETCH_THEMES,
  FETCH_THEMES_FULFILLED,
  FETCH_THEMES_REJECTED,
  TOGGLE_THEME_SELECTED,
} from "./../constants";

export const fetchThemes = () => {
  // ToDo :: use axios once API is plugged in
  /*axios.get('./../data/dataThemes.json')
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
      })*/

  return (dispatch, getState) => {
    dispatch({
      type: FETCH_THEMES,
    });

    try {
      const STATIC_THEME_DATA = require('./../data/tempThemes');

      dispatch({
        type: FETCH_THEMES_FULFILLED,
        payload: STATIC_THEME_DATA,
      })
    } catch (error) {
      dispatch({
        type: FETCH_THEMES_REJECTED,
        payload: error,
      })
    }
  }
};

export const toggleThemeSelected = themeId => ({
  type: TOGGLE_THEME_SELECTED,
  payload: themeId,
});
