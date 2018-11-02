import { FETCH_SOURCE_DATA, FETCH_SOURCE_DATA_FULFILLED, FETCH_SOURCE_DATA_REJECTED } from "./../actions/types";

const initialState = {
  data: [],
  fetching: false,
  fetched: false,
  error: null,
};

export default (state=initialState, action={}) => {
  switch (action.type) {
    case FETCH_SOURCE_DATA: {
      return {
        ...state,
        fetching: true,
      }
    }

    case FETCH_SOURCE_DATA_FULFILLED: {
      return {
        ...state,
        fetching: false,
        fetched: true,
        data: action.payload,
      }
    }

    case FETCH_SOURCE_DATA_REJECTED: {
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
