import {
  FETCH_ATTRIBUTE_DATA,
  FETCH_ATTRIBUTE_DATA_FULFILLED,
  FETCH_ATTRIBUTES_REJECTED,
} from "./../constants";

const initialState = {
  data: [],
  query: {
    themeId: null,
    subthemeId: null,
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
        query: {
          ...state.query,
          themeId: action.payload.query.themeId,
          subthemeId: action.payload.query.subthemeId,
          attributedata: action.payload.query.attributedata,
          grouped: action.payload.query.grouped,
          per_sensor: action.payload.query.per_sensor,
          harmonising_method: action.payload.query.harmonising_method,
          limit: action.payload.query.limit,
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
