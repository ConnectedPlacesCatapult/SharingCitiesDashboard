import _ from 'lodash';
import {
  FETCH_SUBTHEMES,
  FETCH_SUBTHEMES_FULFILLED,
  FETCH_SUBTHEMES_REJECTED,
  TOGGLE_SUBTHEME_SELECTED,
} from "../constants";

const initialState = {
  subthemes: [],
  fetching: false,
  fetched: false,
  error: null,
  selected: [],
};

export default (state=initialState, action={}) => {
  switch (action.type) {
    case FETCH_SUBTHEMES: {
      return {
        ...state,
        fetching: true,
      }
    }

    case FETCH_SUBTHEMES_FULFILLED: {
      return {
        ...state,
        subthemes: action.payload,
        fetching: false,
        fetched: true,
      }
    }

    case FETCH_SUBTHEMES_REJECTED: {
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload,
      }
    }

    case TOGGLE_SUBTHEME_SELECTED: {
      const newSelected = (_.indexOf(state.selected, action.payload) !== -1)
        ? _.without(state.selected, action.payload)
        : [action.payload]
      ;

      return {
        ...state,
        selected: newSelected,
      }
    }
  }

  return state
}
