import {
  FETCH_DATA,
  FETCH_DATA_FULFILLED,
  FETCH_DATA_REJECTED,
  PURGE_DATA,
} from "./../constants";

export const fetchData = request => {
  return (dispatch, getState) => {
    dispatch({
      type: FETCH_DATA,
      payload: request,
    });

    try {
      const STATIC_DATA = require('./../data/tempData');

      dispatch({
        type: FETCH_DATA_FULFILLED,
        payload: STATIC_DATA[request.subtheme],
      })
    }
    catch (error) {
      dispatch({
        type: FETCH_DATA_REJECTED,
        payload: error,
      })
    }
  }
};

export const purgeData = () => ({
  type: PURGE_DATA,
});
