import {
  DISCARD_ATTRIBUTE_DATA,
  FETCH_ATTRIBUTE_DATA,
  FETCH_ATTRIBUTE_DATA_FULFILLED,
  FETCH_ATTRIBUTES_REJECTED,
  PURGE_DATA,
} from "./../constants";

const initialState = {
  data: [],
  fetching: false,
  fetched: false,
  error: null,
};

export default (state=initialState, action={}) => {
  switch (action.type) {
    case DISCARD_ATTRIBUTE_DATA: {
      const newData = state.data.filter((attr) => attr.name !== action.payload.attributeName);

      return {
        ...state,
        data: newData,
      }
    }

    case FETCH_ATTRIBUTE_DATA: {
      return {
        ...state,
        fetching: true,
      }
    }

    case FETCH_ATTRIBUTE_DATA_FULFILLED: {
      const payloadData = action.payload.data.map(attr => ({
        table: attr['Attribute_Table'],
        name: attr['Attribute_Name'],
        description: attr['Attribute_Description'],
        unitValue: attr['Attribute_Unit_Value'],
        totalRecords: attr['Total_Records'],
        values: attr['Attribute_Values'],
      }));

      return {
        ...state,
        fetching: false,
        fetched: true,
        data: [...state.data, ...payloadData],
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

    case PURGE_DATA: {
      return initialState
    }
  }

  return state;
}
