import _ from 'lodash'
import axios from "axios";

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
import {SAVE_WIDGET_FULFILLED, SAVE_WIDGET_REJECTED} from "../constants";

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

    axios({
      url: config.apiRoot + 'widgets',
      method: 'post',
      headers: {
        Authorization: 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NTA1MDUzNTgsIm5iZiI6MTU1MDUwNTM1OCwianRpIjoiZDA4ZGRiNGQtNDE4YS00YWMwLWFkODYtZDQ3ZGM0ZTUyYTQ4IiwiZXhwIjoxNTUxMTEwMTU4LCJpZGVudGl0eSI6InBhdHJpY2tAZG90bW9kdXMuY29tIiwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIiwidXNlcl9jbGFpbXMiOnsiYWRtaW4iOm51bGx9fQ.N_fD7BGjnRL47YFoclmIBnoWzub2ugDJUSNuLwRA0B4'
      },
      data: {
        ...widgetConfig
      },
    })
      .then((response) => {
        dispatch({
          type: SAVE_WIDGET_FULFILLED,
          payload: response.data,
        })
      })
      .catch((err) => {
        dispatch({
          type: SAVE_WIDGET_REJECTED,
          payload: err,
        })
      })

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
