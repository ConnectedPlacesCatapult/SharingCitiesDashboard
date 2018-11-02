import { FETCH_SOURCES, FETCH_SOURCES_FULFILLED, FETCH_SOURCES_REJECTED } from "../actions/types";

const initialState = {
  sources: [],
  fetching: false,
  fetched: false,
  error: null,
};

export default (state=initialState, action={}) => {
  switch (action.type) {
    case FETCH_SOURCES: {
      return {
        ...state,
        fetching: true,
      }
    }

    case FETCH_SOURCES_FULFILLED: {
      return {
        ...state,
        fetching: false,
        fetched: true,
        sources: action.payload,
      }
    }

    case FETCH_SOURCES_REJECTED: {
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload,
      }
    }
  }

  return state
}
