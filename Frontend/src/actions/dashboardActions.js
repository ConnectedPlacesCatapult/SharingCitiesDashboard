import {
  FETCH_LAYOUT,
  FETCH_LAYOUT_FULFILLED,
  FETCH_LAYOUT_REJECTED,
  UPDATE_LAYOUT,
  FETCH_WIDGETS,
  FETCH_WIDGETS_FULFILLED,
  FETCH_WIDGETS_REJECTED,
  ADD_WIDGET,
  UPDATE_WIDGET,
  DELETE_WIDGET,
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
    catch (err) {
      dispatch({
        type: FETCH_LAYOUT_REJECTED,
        payload: err,
      })
    }
  }
};

export const updateLayout = (layout) => ({
  type: UPDATE_LAYOUT,
  payload: layout,
});

export const fetchWidgets = () => {
  return (dispatch, getState) => {
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
    catch (err) {
      dispatch({
        type: FETCH_WIDGETS_REJECTED,
        payload: err,
      })
    }
  }
};
