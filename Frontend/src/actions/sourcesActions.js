import { FETCH_SOURCES, FETCH_SOURCES_FULFILLED, FETCH_SOURCES_REJECTED } from './types';

export function fetchSources() {
  return function (dispatch) {
    dispatch({
      type: FETCH_SOURCES
    });

    try {
      const STATIC_SOURCE_DATA = require('./../data/tempSources');

      dispatch({
        type: FETCH_SOURCES_FULFILLED,
        payload: STATIC_SOURCE_DATA,
      })
    }
    catch (e) {
      dispatch({
        type: FETCH_SOURCES_REJECTED,
        payload: e,
      })
    }
  }
}
