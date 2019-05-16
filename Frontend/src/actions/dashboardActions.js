import { axiosInstance } from './../api/axios';
import { getUserID } from './../api/session';
import {
  DELETE_WIDGET,
  DELETE_WIDGET_FULFILLED,
  DELETE_WIDGET_REJECTED,
  FETCH_WIDGETS,
  FETCH_WIDGETS_FULFILLED,
  FETCH_WIDGETS_REJECTED,
  FETCH_LAYOUT,
  FETCH_LAYOUT_FULFILLED,
  FETCH_LAYOUT_REJECTED,
  UPDATE_LAYOUT,
  SAVE_LAYOUT,
  SAVE_LAYOUT_FULFILLED,
  SAVE_LAYOUT_REJECTED,
  HIDE_NOTIFICATION,
} from './../constants';
import _ from 'lodash'

export const deleteWidget = (widgetId) => {
  return (dispatch) => {
    dispatch({
      type: DELETE_WIDGET,
    });

    const requestData = {
      userID: getUserID(),
      widgetID: parseInt(widgetId),
    };

    axiosInstance
      .post('/widgets/delete_widget', requestData)
      .then((response) => {
        dispatch({
          type: DELETE_WIDGET_FULFILLED,
          payload: parseInt(widgetId),
        })
      })
      .catch((error) => {
        dispatch({
          type: DELETE_WIDGET_REJECTED,
          payload: error,
        })
      })
  }
};

export const fetchLayout = () => {
  return (dispatch) => {
    dispatch({
      type: FETCH_LAYOUT,
    });

    const requestData = {
      userID: getUserID(),
    };

    axiosInstance
      .post('/widgets/get_layouts', requestData)
      .then((response) => {
        const layout = response.data.map((widget) => ({
          i: widget.id,
          x: widget.x,
          y: widget.y,
          w: widget.w,
          h: widget.h,
        }));

        dispatch({
          type: FETCH_LAYOUT_FULFILLED,
          payload: layout,
        })
      })
      .catch((error) => {
        dispatch({
          type: FETCH_LAYOUT_REJECTED,
          payload: error,
        })
      })
  }
};

export const saveLayout = () => {
  const userID = getUserID()

  return (dispatch, getState) => {
    const state = getState()
    const newLayout = _.get(state, 'dashboard.newLayout')

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
      }, 5000)
    })
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
  }
};

export const fetchWidgets = () => {
  return (dispatch) => {
    dispatch({
      type: FETCH_WIDGETS,
    });

    const requestData = {
      userID: getUserID(),
      limit: 10,
    };

    axiosInstance
      .post('widgets/load_widgets', requestData)
      .then((response) => {
        const parsed = response.data.map((widget) => {

          // ToDo :: needs further sanitizing to handle apostrophes within text fields
          const sanitizedString = widget.data
            .replace(/'/g, '"')
            .replace(/False/g, '"false"')
            .replace(/True/g, '"true"')
            .replace(/None/g, '"null"')
            .toString()
          ;
          const widgetData = JSON.parse(sanitizedString);

          return {
            ...widgetData,
            i: widget.id,
            width: parseInt(widgetData.width),
            height: parseInt(widgetData.height),
            w: parseInt(widgetData.w),
            h: parseInt(widgetData.h),
            isStatic: (widgetData.isStatic === 'true'),
          }
        });

        dispatch({
          type: FETCH_WIDGETS_FULFILLED,
          payload: parsed,
        })
      })
      .catch((error) => {
        dispatch({
          type: FETCH_WIDGETS_REJECTED,
          payload: error,
        })
      })
  }
};

export const updateLayout = (layout) => ({
  type: UPDATE_LAYOUT,
  payload: layout,
});
