import {
  FETCH_SUBTHEMES,
  FETCH_SUBTHEMES_FULFILLED,
  FETCH_SUBTHEMES_REJECTED,
  TOGGLE_SUBTHEME_SELECTED,
} from "../constants";

export const fetchSubthemes = themeName => {
  return (dispatch, getState) => {
    dispatch({
      type: FETCH_SUBTHEMES,
      payload: themeName,
    });

    try {
      const STATIC_SUBTHEME_DATA = require('./../data/tempSubthemes');

      dispatch({
        type: FETCH_SUBTHEMES_FULFILLED,
        payload: STATIC_SUBTHEME_DATA,
      })
    } catch (error) {
      dispatch({
        type: FETCH_SUBTHEMES_REJECTED,
        payload: error,
      })
    }
  }
};

export const toggleSubthemeSelected = subthemeId => ({
  type: TOGGLE_SUBTHEME_SELECTED,
  payload: subthemeId,
});
