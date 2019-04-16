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

const initialState = {
  layout: [],
  widgets: [],
  fetching: false,
  fetched: false,
  error: null,
  deleteWidgetDialogOpen: false
};

export default (state=initialState, action={}) => {
  switch (action.type) {

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

    case DELETE_WIDGET_OPEN: {
      return {
        ...state,
        deleteWidgetDialogOpen: true,
      }
    }

    case DELETE_WIDGET_CLOSE: {
      return {
        ...state,
        deleteWidgetDialogOpen: false,
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
