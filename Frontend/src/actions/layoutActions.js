import {
  FETCH_LAYOUT,
  FETCH_LAYOUT_FULFILLED,
  FETCH_LAYOUT_REJECTED
} from "./../constants";

export function fetchLayout() {
  return function (dispatch) {
    dispatch({
      type: FETCH_LAYOUT,
    });

    try {
      const STATIC_LAYOUT_DATA = require('./../data/tempLayout');

      dispatch({
        type: FETCH_LAYOUT_FULFILLED,
        payload: STATIC_LAYOUT_DATA,
      })
    }
    catch (e) {
      dispatch({
        type: FETCH_LAYOUT_REJECTED,
        payload: e,
      })
    }
  }
}
