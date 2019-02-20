import _ from 'lodash'
import axios from "axios";

import {
  FETCH_LAYOUT,
  FETCH_LAYOUT_FULFILLED,
  FETCH_LAYOUT_REJECTED,
  SAVE_LAYOUT,
  SAVE_LAYOUT_FULFILLED,
  SAVE_LAYOUT_REJECTED,
  UPDATE_LAYOUT,
  LAYOUT_CHANGED,
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
  SAVE_WIDGET_REJECTED
} from "./../constants";
import {axiosInstance} from "../api/axios";

// export const fetchLayout = () => {
//   return (dispatch, getState) => {
//
//     const currentState = getState();
//     const totalWidgets = currentState.dashboard.widgets.length
//
//     const layout = []
//
//     for (let i = 0; i < totalWidgets; i++) {
//       const arrayItem = {
//         "i": i.toString(),
//         "x": 0,
//         "y": 0,
//         "w": 5,
//         "h": 8,
//         "static": false
//       }
//       layout.push(arrayItem)
//     }
//
//     dispatch({
//       type: FETCH_LAYOUT,
//     });
//
//     try {
//       const STATIC_LAYOUT_DATA = require('./../data/tempLayout');
//
//       dispatch({
//         type: FETCH_LAYOUT_FULFILLED,
//         payload: STATIC_LAYOUT_DATA,
//       })
//     }
//     catch (err) {
//       dispatch({
//         type: FETCH_LAYOUT_REJECTED,
//         payload: err,
//       })
//     }
//   }
// };

export const updateLayout = (layout) => ({
  type: UPDATE_LAYOUT,
  payload: layout,
});

export const layoutChanged = (layout) => ({
  type: LAYOUT_CHANGED
});

// export const fetchWidgets = () => {
//   return (dispatch, getState) => {
//
//     const currentState = getState();
//     const config = currentState.config.config;
//
//     dispatch({
//       type: FETCH_WIDGETS,
//     });
//
//     try {
//
//       let STATIC_WIDGET_DATA = []
//
//       axios({
//         url: config.apiRoot + 'widgets/load_widgets',
//         method: 'post',
//         headers: {
//           Authorization: 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NTA1MDUzNTgsIm5iZiI6MTU1MDUwNTM1OCwianRpIjoiZDA4ZGRiNGQtNDE4YS00YWMwLWFkODYtZDQ3ZGM0ZTUyYTQ4IiwiZXhwIjoxNTUxMTEwMTU4LCJpZGVudGl0eSI6InBhdHJpY2tAZG90bW9kdXMuY29tIiwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIiwidXNlcl9jbGFpbXMiOnsiYWRtaW4iOm51bGx9fQ.N_fD7BGjnRL47YFoclmIBnoWzub2ugDJUSNuLwRA0B4'
//         },
//         data: {
//           userID: '1',
//           limit: '10'
//         },
//       }).then((res) => {
//
//         const widgetArrayAsString = res.data
//
//         const widgetArrayAsJSON = []
//
//         for (let i = 0; i < widgetArrayAsString.length; i++) {
//           const widgetAsJSON = {
//             i: i.toString(),
//             widgetID: widgetArrayAsString[i],
//             data: JSON.parse(widgetArrayAsString[i].data.replace(/'/g, '"').toString()),
//             spec: JSON.parse(widgetArrayAsString[i].spec.replace(/'/g, '"').toString()),
//             title: widgetArrayAsString[i].title,
//             type: widgetArrayAsString[i].type
//           }
//           widgetArrayAsJSON.push(widgetAsJSON)
//         }
//
//         console.log("widgetArrayAsJSON", widgetArrayAsJSON)
//
//         dispatch({
//           type: FETCH_WIDGETS_FULFILLED,
//           payload: widgetArrayAsJSON,
//         })
//
//       })
//
//     }
//     catch (err) {
//       dispatch({
//         type: FETCH_WIDGETS_REJECTED,
//         payload: err,
//       })
//     }
//   }
// };

export const promptDeleteWidget = (widgetID) => {
  return (dispatch) => {
    dispatch({
      type: PROMPT_WIDGET_DELETE,
      widgetToDelete: widgetID
    });
  };
};

export const fetchWidgets = () => {
  return (dispatch, getState) => {
    dispatch({
      type: FETCH_WIDGETS,
    });
    const requestData = {
      userID: '1',
      limit: '10'
    };
    axiosInstance.post('/widgets/load_widgets', requestData).then((response) => {

      const widgetArrayAsString = response.data
      const widgetArrayAsJSON = []

      for (let i = 0; i < widgetArrayAsString.length; i++) {
        const widgetAsJSON = {
          i: widgetArrayAsString[i].id,
          data: JSON.parse(widgetArrayAsString[i].data.replace(/'/g, '"').toString()),
          spec: JSON.parse(widgetArrayAsString[i].spec.replace(/'/g, '"').toString()),
          title: widgetArrayAsString[i].title,
          type: widgetArrayAsString[i].type
        }
        widgetArrayAsJSON.push(widgetAsJSON)
      }

      dispatch({
        type: FETCH_WIDGETS_FULFILLED,
        payload: widgetArrayAsJSON,
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
  return (dispatch, getState) => {
    dispatch({
      type: FETCH_LAYOUT,
    });

    const requestData = {
      userID: '1'
    };
    axiosInstance.post('/widgets/get_layouts', requestData).then((response) => {

      const layoutReceived = response.data

      console.log("layoutReceived", layoutReceived)

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

    console.log("newLayout", newLayoutObject)

    dispatch({
      type: SAVE_LAYOUT,
    });

    const requestData = {
      userID: '1'
    };
    axiosInstance.post('/widgets/save_layouts', newLayoutObject).then((response) => {

      dispatch({
        type: SAVE_LAYOUT_FULFILLED,
        payload: cleanedLayout,
      })
    })
      .catch((err) => {
        dispatch({
          type: SAVE_LAYOUT_REJECTED,
          payload: err,
        })
      })
  };
};

export const deleteWidget = () => {
  return (dispatch, getState) => {

    const currentState = getState();
    const widgetID = currentState.dashboard.widgetToDelete

    const requestData = {
      limit: '10',
      userID: '1',
      widgetID: widgetID
    };
    axiosInstance.post('/widgets/delete_widget', requestData).then((response) => {
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