import {
  FETCH_WIDGETS,
  FETCH_WIDGETS_FULFILLED,
  FETCH_WIDGETS_REJECTED
} from "./../constants";

export function fetchWidgets() {
  return function (dispatch) {
    dispatch({
      type: FETCH_WIDGETS,
    });

    try {
      const STATIC_WIDGET_DATA = require('./../data/tempWidgets');

      dispatch({
        type: FETCH_WIDGETS_FULFILLED,
        payload: STATIC_WIDGET_DATA,
      })
    }
    catch (e) {
      dispatch({
        type: FETCH_WIDGETS_REJECTED,
        payload: e,
      })
    }
  }
}
