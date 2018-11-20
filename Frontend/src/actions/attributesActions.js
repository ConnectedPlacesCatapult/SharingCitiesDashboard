import {
  FETCH_ATTRIBUTES,
  FETCH_ATTRIBUTES_FULFILLED,
  FETCH_ATTRIBUTES_REJECTED,
} from "../constants";

export const fetchAttributes = subthemeId => {
  return (dispatch, getState) => {
    dispatch({
      type: FETCH_ATTRIBUTES,
    });

    try {
      const STATIC_ATTRIBUTES = require('./../data/tempAttributes');

      dispatch({
        type: FETCH_ATTRIBUTES_FULFILLED,
        payload: STATIC_ATTRIBUTES,
      })
    } catch(error) {
      dispatch({
        type: FETCH_ATTRIBUTES_REJECTED,
        payload: error,
      })
    }

  }
};
