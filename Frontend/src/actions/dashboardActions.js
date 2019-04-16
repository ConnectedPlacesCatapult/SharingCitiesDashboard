import {
  FETCH_LAYOUT,
  FETCH_LAYOUT_FULFILLED,
  FETCH_LAYOUT_REJECTED,
  UPDATE_LAYOUT,
  FETCH_WIDGETS,
  FETCH_WIDGETS_FULFILLED,
  FETCH_WIDGETS_REJECTED,
  DELETE_WIDGET_OPEN,
  DELETE_WIDGET_CLOSE
} from "./../constants";

export const fetchLayout = () => {
  return (dispatch, getState) => {
    dispatch({
      type: FETCH_LAYOUT,
    });

    try {
      const STATIC_LAYOUT_DATA = require('./../data/layout');

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
      const STATIC_WIDGET_DATA = require('./../data/widgets');

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

export const closeDeleteWidget = () => ({
  type: DELETE_WIDGET_CLOSE,
});

export const openDeleteWidget = () => ({
  type: DELETE_WIDGET_OPEN,
  payload: {
    widgetProperties,
  },
});


export const deleteWidget = () => {
  return (dispatch, getState) => {

    const currentState = getState();
    const widgetID = currentState.dashboard.widgetToDelete
    const userID = currentState.user.user.id

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

