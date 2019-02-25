import {
  SAVE_LAYOUT_FULFILLED
} from "./../constants";

const initialState = {
  message: 'TEsting',
  showAlert: true
};

export default (state=initialState, action={}) => {
  switch (action.type) {

    case SAVE_LAYOUT_FULFILLED: {
      return {
        ...state,
        message: 'Layout Saved',
        variant: 'success'
      }
    }

  }
  return state;
}
