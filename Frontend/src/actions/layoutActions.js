import {
  FETCH_LAYOUT,
  FETCH_LAYOUT_FULFILLED,
  FETCH_LAYOUT_REJECTED
} from "./../constants";

export const fetchLayout = () => {
  return (dispatch, getState) => {
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
    catch (error) {
      dispatch({
        type: FETCH_LAYOUT_REJECTED,
        payload: error,
      })
    }
  }
};
