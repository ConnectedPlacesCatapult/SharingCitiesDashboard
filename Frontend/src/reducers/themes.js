import _ from 'lodash';

import {
  FETCH_THEMES,
  FETCH_THEMES_FULFILLED,
  FETCH_THEMES_REJECTED,
  TOGGLE_THEME_SELECTED,
} from "../actions/types";

const initialState = {
  themes: [],
  fetching: false,
  fetched: false,
  error: null,
  selected: [],
};

export default (state=initialState, action={}) => {
  switch (action.type) {
    case FETCH_THEMES: {
      return {
        ...state,
        fetching: true,
      }
    }

    case FETCH_THEMES_FULFILLED: {
      return {
        ...state,
        fetching: false,
        fetched: true,
        themes: action.payload,
      }
    }

    case FETCH_THEMES_REJECTED: {
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload,
      }
    }

    case TOGGLE_THEME_SELECTED: {
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

  return state;
}
