import {
  SAVE_LAYOUT_FULFILLED,
  UPDATE_LAYOUT,
  HIDE_NOTIFICATION,
  CREATE_NEW_USER_FULFILLED,
  DELETE_USER_FULFILLED,
  SAVE_WIDGET_FULFILLED
} from "./../constants";

const initialState = {
  message: 'Testing',
  showAlert: false,
  variant: 'defaultNotification',
};

export default (state=initialState, action={}) => {
  switch (action.type) {

    case SAVE_LAYOUT_FULFILLED: {
      return {
        ...state,
        message: 'Layout Saved',
        showAlert: true,
        variant: 'successNotification'
      }
    }

    case CREATE_NEW_USER_FULFILLED: {
      return {
        ...state,
        message: 'User Added',
        showAlert: true,
        variant: 'successNotification'
      }
    }

    case DELETE_USER_FULFILLED: {
      return {
        ...state,
        message: 'User Deleted',
        showAlert: true,
        variant: 'successNotification'
      }
    }

    case SAVE_WIDGET_FULFILLED: {
      return {
        ...state,
        message: 'Widget Saved and Added to Dashboard',
        showAlert: true,
        variant: 'successNotification'
      }
    }

    case HIDE_NOTIFICATION: {
      return {
        ...state,
        showAlert: false,
      }
    }

  }
  return state;
}