import {
  FETCH_DATA,
  FETCH_DATA_FULFILLED,
  FETCH_DATA_REJECTED
} from "./types";

export function fetchData(requestData) {
  return function (dispatch) {
    dispatch({
      type: FETCH_DATA,
      payload: requestData,
    });

    try {
      const STATIC_DATA = require('./../data/tempData');

      dispatch({
        type: FETCH_DATA_FULFILLED,
        payload: STATIC_DATA[requestData.source],
      })
    }
    catch (e) {
      dispatch({
        type: FETCH_DATA_REJECTED,
        payload: e,
      })
    }
  }
}
