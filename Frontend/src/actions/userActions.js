import { axiosInstance } from '../api/axios'
import {SET_CURRENT_USER, REQUEST_PASSWORD_FULFILLED, REQUEST_PASSWORD_REJECTED, LOGIN_REJECTED, CLEAR_LOGIN_ERRORS, REGISTER_FULFILLED, REGISTER_REJECTED} from './../constants';
import {SET_WIDGET_PROPERTY} from "../constants";

export const login = (userCredentials, props) => {
  return (dispatch) => {
    const credentials = {
      email: userCredentials.email,
      password: userCredentials.password,
      remember: userCredentials.remember
    }
    axiosInstance.post('/login', credentials).then((response) => {
      dispatch({
        type: SET_CURRENT_USER,
        payload: response.data,
      })
      const token = response.data.access_token
      const userName = response.data.fullname
      const userID = response.data.id
      const userEmail = credentials.email
      localStorage.setItem('token', token)
      localStorage.setItem('userName', userName)
      localStorage.setItem('userID', userID)
      localStorage.setItem('userEmail', userEmail)
      props.history.push('/')
    })
    .catch((err) => {
      console.log('login failed', err)
      dispatch({
        type: LOGIN_REJECTED,
        payload: err,
      })
    })
  };
};

export const getUser = () => {
  return (dispatch) => {
    const user = {
      email: localStorage.getItem('userEmail')
    }
    axiosInstance.post('/admin/get_user_by_email', user).then((response) => {
      dispatch({
        type: SET_CURRENT_USER,
        payload: response.data,
      })
    })
  };
};

export function doRegister(userCredentials) {
  return (dispatch) => {
    const credentials = {
      email: userCredentials.email,
      fullName: userCredentials.fullName,
      password: userCredentials.password,
      password_new: userCredentials.passwordNew
    }
    const session = axiosInstance.post('/register', credentials).then((response) => {
      dispatch({
        type: REGISTER_FULFILLED,
        payload: response,
      })
    })
    .catch((err) => {
      dispatch({
        type: REGISTER_REJECTED,
        payload: err,
      })
    })
  }
}

export const requestPassword = (email) => {
  return (dispatch) => {
    const userInfo = {
      email: email,
    }
    const session = axiosInstance.post('/forgot_password', userInfo).then((response) => {
      dispatch({
        type: REQUEST_PASSWORD_FULFILLED,
      })
    })
    .catch((err) => {
      dispatch({
        type: REQUEST_PASSWORD_REJECTED,
        payload: err,
      })
    })
  }
}

export const clearLoginErrors = () => {
  return (dispatch) => {
    dispatch({
      type: CLEAR_LOGIN_ERRORS,
    })
  }
}

export function doLogout(props) {
  localStorage.removeItem('token');
  localStorage.removeItem('fullname');
  localStorage.removeItem('id');
  props.history.push('/login')
}
