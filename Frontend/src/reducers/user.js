import isEmpty from 'lodash/isEmpty';

import { SET_CURRENT_USER, REQUEST_PASSWORD_FULFILLED, REQUEST_PASSWORD_REJECTED, CLEAR_LOGIN_ERRORS, LOGIN_REJECTED } from './../constants';

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
        isAuthenticated: !isEmpty(action.user),
        user: action.payload
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

    case CLEAR_LOGIN_ERRORS: {
      return {
        loginMessage: '',
        loginError: ''
      }
    }

  }

  return state
}
