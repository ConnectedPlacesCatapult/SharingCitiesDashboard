import isEmpty from 'lodash/isEmpty';

import { SET_CURRENT_USER, SET_CURRENT_USER_REJECTED, REQUEST_PASSWORD_FULFILLED, REQUEST_PASSWORD_REJECTED, CLEAR_LOGIN_ERRORS, LOGIN_REJECTED, REGISTER_FULFILLED, REGISTER_REJECTED, RESET_STATE} from './../constants';

const initialState = {
  isAuthenticated: false,
  user: {},
  loginMessage: '',
  loginError: ''
};

export default (state=initialState, action={}) => {

  switch(action.type) {
    case SET_CURRENT_USER: {
      return {
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      }
    }

    case SET_CURRENT_USER_REJECTED: {
      return {
        isAuthenticated: false,
      }
    }

    case LOGIN_REJECTED: {
      return {
        loginMessage: '',
        loginError: action.payload.response.data.message
      }
    }

    case REQUEST_PASSWORD_FULFILLED: {
      return {
        loginMessage: 'Password request successful. Please check your inbox',
        loginError: ''
      }
    }

    case REQUEST_PASSWORD_REJECTED: {
      return {
        loginMessage: '',
        loginError: action.payload.response.data.message
      }
    }

    case REGISTER_FULFILLED: {
      return {
        loginMessage: action.payload.data.message,
        loginError: ''
      }
    }

    case REGISTER_REJECTED: {
      return {
        loginMessage: '',
        loginError: action.payload.response.data.message
      }
    }

    case CLEAR_LOGIN_ERRORS: {
      return {
        loginMessage: '',
        loginError: ''
      }
    }

    case RESET_STATE: {
      return initialState
    }

  }

  return state
}
