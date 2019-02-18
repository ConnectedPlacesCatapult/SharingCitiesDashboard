import _ from 'lodash'
import {
  FETCH_LAYOUT,
  FETCH_LAYOUT_FULFILLED,
  FETCH_LAYOUT_REJECTED,
  UPDATE_LAYOUT,
  LAYOUT_CHANGED,
  FETCH_WIDGETS,
  FETCH_WIDGETS_FULFILLED,
  FETCH_WIDGETS_REJECTED,
  ADD_WIDGET,
  UPDATE_WIDGET,
  DELETE_WIDGET,
} from "./../constants";
import {axiosInstance} from "../api/axios";

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

export const layoutChanged = (layout) => ({
  type: LAYOUT_CHANGED
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

export const fetchWidgetsNew = () => {
  return (dispatch, getState) => {
    dispatch({
      type: FETCH_WIDGETS,
    });

    try {
      const WIDGET_DATA = axiosInstance.post('/widgets', userInfo).then((res) => {

      })
      dispatch({
        type: FETCH_WIDGETS_FULFILLED,
        payload: WIDGET_DATA,
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

export const fetchLayoutNew = () => {
  return (dispatch, getState) => {
    dispatch({
      type: FETCH_LAYOUT,
    });

    try {
      const WIDGET_DATA = axiosInstance.post('/layout', userInfo).then((res) => {

      })
      dispatch({
        type: FETCH_WIDGETS_FULFILLED,
        payload: WIDGET_DATA,
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


export function saveLayout() {
  return (dispatch, getState) => {
    console.log(getState())
    const state = getState()
    const dashboardLayout = _.get(state, 'dashboard.layout')
    console.log(dashboardLayout)
  }
}
