import { FETCH_WIDGETS, FETCH_WIDGETS_FULFILLED, FETCH_WIDGETS_REJECTED } from "./../actions/types";

const initialState = {
  widgets: [],
  fetching: false,
  fetched: false,
  error: null,
};

export default (state = initialState, action = {}) => {
  switch(action.type) {
    case FETCH_WIDGETS:
      return {
        ...state,
        fetching: true,
      };

    case FETCH_WIDGETS_FULFILLED:
      return {
        ...state,
        fetching: false,
        fetched: true,
        widgets: action.payload,
      };

    case FETCH_WIDGETS_REJECTED:
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload,
      };

    default: return state;
  }
}
