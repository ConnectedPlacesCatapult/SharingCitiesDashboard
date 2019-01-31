import {
  FETCH_ATTRIBUTE_DATA,
  FETCH_ATTRIBUTE_DATA_FULFILLED,
  FETCH_ATTRIBUTES_REJECTED,
} from "./../constants";

const initialState = {
  data: [],
  fetching: false,
  fetched: false,
  error: null,
};

export default (state=initialState, action={}) => {
  switch (action.type) {

    case FETCH_ATTRIBUTE_DATA: {
      return {
        ...state,
        fetching: true,
      }
    }

    case FETCH_ATTRIBUTE_DATA_FULFILLED: {
      return {
        ...state,
        fetching: false,
        fetched: true,
        data: action.payload,
      }
    }

    case FETCH_ATTRIBUTES_REJECTED: {
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
