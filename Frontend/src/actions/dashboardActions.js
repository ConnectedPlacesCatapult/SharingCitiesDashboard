import _ from 'lodash'
import {axiosInstance} from "../api/axios";
import {getUserID} from "../api/session";

import {
  FETCH_LAYOUT,
  FETCH_LAYOUT_FULFILLED,
  FETCH_LAYOUT_REJECTED,
  SAVE_LAYOUT,
  SAVE_LAYOUT_FULFILLED,
  SAVE_LAYOUT_REJECTED,
  SAVE_LAYOUT_DISMISSED,
  UPDATE_LAYOUT,
  FETCH_WIDGETS,
  FETCH_WIDGETS_FULFILLED,
  FETCH_WIDGETS_REJECTED,
  ADD_WIDGET,
  UPDATE_WIDGET,
  DELETE_WIDGET,
  DELETE_WIDGET_FULFILLED,
  DELETE_WIDGET_REJECTED,
  PROMPT_WIDGET_DELETE,
  CANCEL_WIDGET_DELETE,
  FETCH_USERS,
  FETCH_USERS_FULFILLED,
  FETCH_USERS_REJECTED,
  SAVE_WIDGET_FULFILLED,
  SAVE_WIDGET_REJECTED,
  HIDE_NOTIFICATION
} from "./../constants";

export const updateLayout = (layout) => ({
  type: UPDATE_LAYOUT,
  payload: layout,
});

export const promptDeleteWidget = (widgetID) => {
  return (dispatch) => {
    dispatch({
      type: PROMPT_WIDGET_DELETE,
      widgetToDelete: widgetID
    });
  };
};

export const fetchWidgets = () => {
  const userID = getUserID()

  return (dispatch, getState) => {
    dispatch({
      type: FETCH_WIDGETS,
    });
    const requestData = {
      userID: userID,
      limit: 10
    };

    axiosInstance.post('/widgets/load_widgets', requestData).then((response) => {
      const widgetsAsJSON = []
      const widgetArrayAsString = response.data

      for (let i = 0; i < widgetArrayAsString.length; i++) {
        const widgetData = JSON.parse(widgetArrayAsString[i].data.replace(/'/g, '"').replace(/False/g, '"false"').replace(/True/g, '"true"').toString())
        if (widgetData.type === 'plot') {
          const widgetAsJSON = {
            i: widgetArrayAsString[i].id,
            userID: widgetArrayAsString[i].userID,
            type: widgetData.type,
            title: widgetData.name,
            ...widgetData.plotConfig
          }
          widgetsAsJSON.push(widgetAsJSON)
        }
        if (widgetData.type === 'map') {
          const widgetAsJSON = {
            i: widgetArrayAsString[i].id,
            userID: widgetArrayAsString[i].userID,
            type: widgetData.type,
            title: widgetData.name,
            ...widgetData.mapConfig
          }
          widgetsAsJSON.push(widgetAsJSON)
        }
        if (widgetData.type === 'alert') {
          const widgetAsJSON = {
            i: widgetArrayAsString[i].id,
            userID: widgetArrayAsString[i].userID,
            type: widgetData.type,
            title: widgetData.name,
            ...widgetData.alertConfig
          }
          widgetsAsJSON.push(widgetAsJSON)
        }
      }

      dispatch({
        type: FETCH_WIDGETS_FULFILLED,
        payload: widgetsAsJSON,
      })
    })
    .catch((err) => {
      dispatch({
        type: FETCH_WIDGETS_REJECTED,
        payload: err,
      })
    })
  };
};

export const fetchLayout = () => {
  const userID = getUserID()

  return (dispatch, getState) => {
    dispatch({
      type: FETCH_LAYOUT,
    });

    const requestData = {
      userID: userID
    };
    axiosInstance.post('/widgets/get_layouts', requestData).then((response) => {
      const layoutReceived = response.data
      const layoutFixed = []
      for (let i = 0; i < layoutReceived.length; i++) {
        const layoutItem = {
          i: layoutReceived[i].id,
          x: layoutReceived[i].x,
          y: layoutReceived[i].y,
          w: layoutReceived[i].w,
          h: layoutReceived[i].h,
        }
        layoutFixed.push(layoutItem)
      }
      dispatch({
        type: FETCH_LAYOUT_FULFILLED,
        payload: layoutFixed,
      })
    })
      .catch((err) => {
        dispatch({
          type: FETCH_LAYOUT_REJECTED,
          payload: err,
        })
      })
  };
};

export const saveLayout = () => {
  const userID = getUserID()

  return (dispatch, getState) => {
    const state = getState()
    const newLayout = _.get(state, 'dashboard.layout')

    const cleanedLayout = []

    for (let i = 0; i < newLayout.length; i++) {
      const layoutItem = {
        id: newLayout[i].i,
        x: newLayout[i].x,
        y: newLayout[i].y,
        h: newLayout[i].h,
        w: newLayout[i].w,
        static: "false"
      }
      cleanedLayout.push(layoutItem)
    }

    const newLayoutObject = {
      layouts: cleanedLayout
    }

    dispatch({
      type: SAVE_LAYOUT,
    });

    const requestData = {
      userID: userID
    };
    axiosInstance.post('/widgets/save_layouts', newLayoutObject).then((response) => {

      dispatch({
        type: SAVE_LAYOUT_FULFILLED
      })

      setTimeout(() => {
        dispatch({
          type: HIDE_NOTIFICATION,
        })
      }, 2000)

    .catch((error) => {
        dispatch({
          type: SAVE_LAYOUT_REJECTED,
          payload: error.statusText,
        })
      })
      setTimeout(() => {
        dispatch({
          type: HIDE_NOTIFICATION,
        })
      }, 5000)
    })
  }
};

export const dismissSaveLayout = () => {
  return (dispatch) => {
    dispatch({
      type: SAVE_LAYOUT_DISMISSED,
    });
  };
};

export const deleteWidget = () => {
  const userID = getUserID()

  return (dispatch, getState) => {

    const currentState = getState();
    const widgetID = currentState.dashboard.widgetToDelete

    const requestData = {
      limit: '10',
      userID: userID,
      widgetID: widgetID
    };
    axiosInstance.post('/widgets/delete_widget', requestData).then((response) => {
      fetchWidgets()(
        dispatch, getState
      );
      fetchLayout()(
        dispatch, getState
      );
      dispatch({
        type: DELETE_WIDGET_FULFILLED,
        payload: response.data,
      })
    })
    .catch((err) => {
      dispatch({
        type: DELETE_WIDGET_REJECTED,
        payload: err,
      })
    })
  };
};

export const cancelDeleteWidget = () => {
  return (dispatch) => {
    dispatch({
      type: CANCEL_WIDGET_DELETE,
      widgetToDelete: null
    });
  };
};