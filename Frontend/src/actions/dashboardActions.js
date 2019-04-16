import { axiosInstance } from './../api/axios';
import { getUserID } from './../api/session';
import {
  FETCH_LAYOUT,
  FETCH_LAYOUT_FULFILLED,
  FETCH_LAYOUT_REJECTED,
  UPDATE_LAYOUT,
  FETCH_WIDGETS,
  FETCH_WIDGETS_FULFILLED,
  FETCH_WIDGETS_REJECTED,
} from './../constants';

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

export const updateLayout = (layout) => ({
  type: UPDATE_LAYOUT,
  payload: layout,
});

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

          // ToDo :: needs further sanitizing to handle apostrophes
          const sanitizedString = widget.data.replace(/'/g, '"').replace(/False/g, '"false"').replace(/True/g, '"true"').toString();
          const widgetData = JSON.parse(sanitizedString);

          return {
            ...widgetData,
            i: widget.id,
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
