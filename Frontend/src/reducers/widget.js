import { ADD_WIDGET, EDIT_WIDGET, DELETE_WIDGET } from "./../actions/types";

const initialState = {
  datasource: null,
  data: [],
  isError: false,
  isFetching: false,
};

export default (state = initialState, action = {}) => {
  switch(action.type) {
    case ADD_WIDGET:
      return {
        ...state,
        datasource: action.datasource,
        data: [],

      };

    case EDIT_WIDGET:
      return {
        ...state,
      };

    case DELETE_WIDGET:
      return {
        ...state,
      };

    default: return state;
  }
}
