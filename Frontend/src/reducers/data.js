import {
  FETCH_DATA,
  FETCH_DATA_FULFILLED,
  FETCH_DATA_REJECTED
} from "./../actions/types";

const initialState = {
  data: [],
  source: null,
  theme: null,
  meta: null,
  fetching: false,
  fetched: false,
  error: null,
};

export default (state=initialState, action={}) => {
  switch (action.type) {
    case FETCH_DATA: {
      return {
        ...state,
        ...action.payload,
        fetching: true,
      }
    }

    case FETCH_DATA_FULFILLED: {
      return {
        ...state,
        fetching: false,
        fetched: true,
        data: action.payload,
      }
    }

    case FETCH_DATA_REJECTED: {
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
