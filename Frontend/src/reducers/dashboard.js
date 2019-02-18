import {
  FETCH_LAYOUT,
  FETCH_LAYOUT_FULFILLED,
  FETCH_LAYOUT_REJECTED,
  UPDATE_LAYOUT,
  FETCH_WIDGETS,
  FETCH_WIDGETS_FULFILLED,
  FETCH_WIDGETS_REJECTED,
} from "./../constants";

const initialState = {
  layout: [],
  widgets: [],
  fetching: false,
  fetched: false,
  layoutChanged: 0,
  error: null,
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

    case UPDATE_LAYOUT: {
      return {
        ...state,
        layout: action.payload,
        layoutChanged: state.layoutChanged + 1
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
