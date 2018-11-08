import { FETCH_SOURCES, FETCH_SOURCES_FULFILLED, FETCH_SOURCES_REJECTED, TOGGLE_SOURCE_SELECTED } from "../actions/types";
import _ from "lodash";

const initialState = {
  sources: [],
  fetching: false,
  fetched: false,
  error: null,
  selected: [],
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

    case TOGGLE_SOURCE_SELECTED: {
      const index = _.indexOf(state.selected, action.payload);
      const newSelected = (index !== -1)
        ? _.without(state.selected, action.payload)
        : [...state.selected, action.payload]
      ;

      return {
        ...state,
        selected: newSelected,
      }
    }
  }

  return state
}
