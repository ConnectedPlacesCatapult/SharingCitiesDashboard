import { FETCH_CONFIG, FETCH_CONFIG_FULFILLED, FETCH_CONFIG_REJECTED } from "./types";

export function fetchConfig() {
  return function(dispatch) {
    dispatch({
      type: FETCH_CONFIG,
    });

    try {
      const STATIC_CONFIG_DATA = require('./../../fcc.config');

      dispatch({
        type: FETCH_CONFIG_FULFILLED,
        payload: STATIC_CONFIG_DATA,
      })
    } catch (e) {
      dispatch({
        type: FETCH_CONFIG_REJECTED,
        payload: e,
      })
    }
  }
}
