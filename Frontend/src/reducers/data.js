import {
  FETCH_ATTRIBUTE_DATA,
  FETCH_ATTRIBUTE_DATA_FULFILLED,
  FETCH_ATTRIBUTES_REJECTED,
} from "./../constants";

const initialState = {
  data: [],
  themeId: null,
  subthemeId: null,
  queryParams: {
    attributedata: [],
    grouped: null,
    per_sensor: null,
    harmonising_method: 'long',
    limit: 100,
  },
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
      // ToDo :: tidy this

      return {
        ...state,
        fetching: false,
        fetched: true,
        data: action.payload.data,
        themeId: action.payload.themeId,
        subthemeId: action.payload.subthemeId,
        queryParams: {
          ...state.queryParams,
          ...action.payload.queryParams,
        }
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
