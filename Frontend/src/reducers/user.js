import isEmpty from 'lodash/isEmpty';

import {
  SET_CURRENT_USER,
  SET_CURRENT_USER_REJECTED,
  REQUEST_PASSWORD_FULFILLED,
  REQUEST_PASSWORD_REJECTED,
  CLEAR_LOGIN_ERRORS,
  LOGIN_REJECTED,
  REGISTER_FULFILLED,
  REGISTER_REJECTED,
  RESET_STATE,
  SHOW_CHANGE_PASSWORD,
  HIDE_CHANGE_PASSWORD,
  PASSWORD_CHANGE_FULFILLED,
  PASSWORD_CHANGE_REJECTED
} from './../constants';

const initialState = {
  isAuthenticated: false,
  user: {},
  loginMessage: '',
  loginError: '',
  showChangePassword: false
};

export default (state=initialState, action={}) => {

  switch(action.type) {

    case SHOW_CHANGE_PASSWORD: {
      return {
        ...state,
        showChangePassword: true,
      }
    }

    case HIDE_CHANGE_PASSWORD: {
      return {
        ...state,
        showChangePassword: false,
      }
    }

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

    case PASSWORD_CHANGE_FULFILLED: {
      return {
        loginMessage: 'Your password was successfully changed. Please login with your new credentials',
        loginError: ''
      }
    }

    case PASSWORD_CHANGE_REJECTED: {
      return {
        ...state,
        loginMessage: '',
        loginError: 'There was a problem changing your password'
      }
    }

    case CLEAR_LOGIN_ERRORS: {
      return {
        ...state,
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