import {
  DELETE_WIDGET_FULFILLED,
  DELETE_WIDGET_REJECTED,
  FETCH_LAYOUT,
  FETCH_LAYOUT_FULFILLED,
  FETCH_LAYOUT_REJECTED,
  UPDATE_LAYOUT,
  FETCH_WIDGETS,
  FETCH_WIDGETS_FULFILLED,
  FETCH_WIDGETS_REJECTED
} from "./../constants";

const initialState = {
  alertsActive: false,
  layout: [],
  widgets: [],
  fetching: false,
  fetched: false,
  error: null,
};

export default (state=initialState, action={}) => {
  switch (action.type) {

    case DELETE_WIDGET_FULFILLED: {
      return {
        ...state,
        layout: state.layout.filter((item) => parseInt(item.i) !== action.payload),
        widgets: state.widgets.filter((widget) => parseInt(widget.i) !== action.payload),
      }
    }

    case DELETE_WIDGET_REJECTED: {
      return {
        ...state,
        error: action.payload,
      }
    }

    case FETCH_LAYOUT: {
      return {
        ...state,
        fetching: true,
      }
    }

    case FETCH_LAYOUT_FULFILLED: {
      return {
        ...state,
        fetching: false,
        fetched: true,
        layout: action.payload,
      }
    }

    case FETCH_LAYOUT_REJECTED: {
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload,
      }
    }

    case UPDATE_LAYOUT: {
      return {
        ...state,
        layout: action.payload,
      }
    }

    case FETCH_WIDGETS: {
      return {
        ...state,
        fetching: true,
      }
    }

    case FETCH_WIDGETS_FULFILLED: {
      return {
        ...state,
        fetching: false,
        fetched: true,
        widgets: action.payload,
      }
    }

    case FETCH_WIDGETS_REJECTED: {
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload,
      }
    }

  }

  return state;
}
