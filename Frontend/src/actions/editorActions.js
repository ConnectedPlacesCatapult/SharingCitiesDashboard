import { axiosInstance } from './../api/axios';
import { getUserID } from './../api/session';
import {
  EDITOR_CLOSE,
  EDITOR_GET_THEME_TREE,
  EDITOR_GET_THEME_TREE_FULFILLED,
  EDITOR_GET_THEME_TREE_REJECTED,
  EDITOR_MODE_ADD,
  EDITOR_MODE_EDIT,
  EDITOR_OPEN,
  EDITOR_SAVE_WIDGET,
  EDITOR_SAVE_WIDGET_FULFILLED,
  EDITOR_SAVE_WIDGET_REJECTED,
  EDITOR_SET_WIDGET_PROPERTY,
  EDITOR_SET_WIDGET_CONFIG_PROPERTY,
  EDITOR_SET_WIDGET_QUERY_PROPERTY,
  HIDE_NOTIFICATION,
  WIDGET_TYPE_ALERT,
  WIDGET_TYPE_FORECAST,
  WIDGET_TYPE_MAP,
  WIDGET_TYPE_PLOT,
} from './../constants';
import { fetchLayout, fetchWidgets } from './dashboardActions';

export const closeEditor = () => ({
  type: EDITOR_CLOSE,
});

export const getThemeTree = () =>  {
  return (dispatch) => {
    dispatch({
      type: EDITOR_GET_THEME_TREE,
    });

    const requestData = {
      user_id: getUserID(),
    };

    axiosInstance
      .get('/admin/themes/get_tree', requestData)
      .then((response) => {

        dispatch({
          type: EDITOR_GET_THEME_TREE_FULFILLED,
          payload: response.data,
        })
      })
      .catch((error) => {
        dispatch({
          type: EDITOR_GET_THEME_TREE_REJECTED,
          payload: error,
        })
      })
  }
};

export const openEditor = (mode, widgetProperties=null) => ({
  type: EDITOR_OPEN,
  payload: {
    mode,
    widgetProperties,
  },
});

export const saveWidget = (mode, widget) => {
  return (dispatch, getState) => {
    dispatch({
      type: EDITOR_SAVE_WIDGET,
    });

    // check we're not submitting spaces or invalid numbers if it's an alert
    if (widget.type === WIDGET_TYPE_ALERT) {
      if (mode === EDITOR_MODE_ADD) {
        // ToDo :: also need to save the alert along with the widget here first
      } else {
        // ToDo :: need to update the alert here first
      }

      console.log(widget);
      return;
    }

    // remove data if it's a plot
    if (widget.type === WIDGET_TYPE_PLOT) {
      widget.config.data = { values: [] };
    }

    const currentState = getState();

    const requestData = {
      userID: currentState.user.user.id,
      data: widget,
    };

    if (mode === EDITOR_MODE_EDIT) {
      requestData.widgetID = widget.i;
    }

    axiosInstance.post("widgets/create_widget", requestData).then((response) => {
      dispatch(fetchWidgets());
      dispatch(fetchLayout());

      dispatch({
        type: EDITOR_SAVE_WIDGET_FULFILLED,
        payload: response.data,
      });

      setTimeout(() => {
        dispatch({
          type: HIDE_NOTIFICATION,
        })
      }, 2000)
    })
      .catch((error) => {
        dispatch({
          type: EDITOR_SAVE_WIDGET_REJECTED,
          payload: error,
        });

        setTimeout(() => {
          dispatch({
            type: HIDE_NOTIFICATION,
          })
        }, 5000)
      });
  };
};

export const setWidgetProperty = (property, value) => ({
  type: EDITOR_SET_WIDGET_PROPERTY,
  payload: {
    property,
    value,
  },
});

export const setWidgetConfigProperty = (property, value) => ({
  type: EDITOR_SET_WIDGET_CONFIG_PROPERTY,
  payload: {
    property,
    value,
  },
});

export const setWidgetQueryProperty = (property, value) => ({
  type: EDITOR_SET_WIDGET_QUERY_PROPERTY,
  payload: {
    property,
    value,
  },
});
