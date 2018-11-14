import {
  FETCH_CONFIG,
  FETCH_CONFIG_FULFILLED,
  FETCH_CONFIG_REJECTED
} from "./../constants";

const initialState = {
  config: {},
  fetching: false,
  fetched: false,
  error: null,
};

export default (state=initialState, action={}) => {
  switch (action.type) {
    case FETCH_CONFIG: {
      return {
        ...state,
        fetching: true,
      }
    }

    case FETCH_CONFIG_FULFILLED: {
      return {
        ...state,
        fetching: false,
        fetched: true,
        config: action.payload,
      }
    }

    case FETCH_CONFIG_REJECTED: {
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
