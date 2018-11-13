import {
  PURGE_EDITOR,
  SET_CURRENT_WIDGET,
} from "./../actions/types";

const initialState = {
  config: [],
};

export default (state=initialState, action={}) => {
  switch (action.type) {
    case PURGE_EDITOR: {
      return initialState
    }

    case SET_CURRENT_WIDGET: {

    }
  }

  return state
}
