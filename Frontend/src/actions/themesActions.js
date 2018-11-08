//import axios from "axios";
import {
  FETCH_THEMES,
  FETCH_THEMES_FULFILLED,
  FETCH_THEMES_REJECTED,
  TOGGLE_THEME_SELECTED,
} from "./types";

export function fetchThemes() {
  return function(dispatch) {
    dispatch({
      type: FETCH_THEMES
    });

    // ToDo: Plug this into a real API
    // ToDo: For now just pulling in data from a JSON file
    try {
      const STATIC_THEME_DATA = require('./../data/tempThemes');

      dispatch({
        type: FETCH_THEMES_FULFILLED,
        payload: STATIC_THEME_DATA,
      })
    }
    catch (e) {
      dispatch({
        type: FETCH_THEMES_REJECTED,
        payload: e,
      })
    }

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
  }
}

export function toggleThemeSelected(id) {
  return {
    type: TOGGLE_THEME_SELECTED,
    payload: id,
  }
}
