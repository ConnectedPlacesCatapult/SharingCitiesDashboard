import { SET_CURRENT_DATASOURCE } from "./../actions/types";

const initialState = {
  datasource: null,
  data: [],
  isError: false,
  isFetching: false,
};

export default (state = initialState, action = {}) => {
  switch(action.type) {
    case SET_CURRENT_DATASOURCE:
      return {
        ...state,
        datasource: action.datasource,
        data: [],

      };

    default: return state;
  }
}
