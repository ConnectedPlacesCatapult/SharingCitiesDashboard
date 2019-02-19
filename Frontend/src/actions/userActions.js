import { axiosInstance } from '../api/axios'
import setAuthorizationToken from '../utils/setAuthorizationToken';
import jwtDecode from 'jwt-decode';

import { SET_CURRENT_USER } from './../constants';
import {FETCH_CONFIG, FETCH_CONFIG_FULFILLED, FETCH_CONFIG_REJECTED} from "../constants";

export function doLogin(email, password, loginFailedFN, props) {

  const credentials = {
    email: email,
    password: password
  }

  const session = axiosInstance.post('/login', credentials).then((res) => {
    const token = res.data.access_token
    localStorage.setItem('token', token)
    props.history.push('/')
  }).catch(function (e) {
    console.log('login failed', e)
    loginFailedFN(e)
  })
}

export function doRegister(email, fullName, password, passwordNew) {
  const userInfo = {
    email: email,
    fullName: fullName,
    password: password,
    password_new: passwordNew
  }

  const session = axiosInstance.post('/register', userInfo).then((res) => {
    console.log(res.data)
  }).catch(function (e) {
    console.log('registration failed', e)
  })
}

export function doUserDelete(email, fullName, password, passwordNew) {

  const userInfo = {
    email: email,
    fullName: fullName,
    password: password,
    password_new: passwordNew
  }

  console.log(userInfo)

  // const session = axiosInstance.post('/admin/delete_user', userInfo).then((res) => {
  //   console.log(res.data)
  // }).catch(function (e) {
  //   console.log('Failed to delete user', e)
  // })
}

export function doLogout(props) {
  localStorage.removeItem('token');
  props.history.push('/login')
}

export const setCurrentUser = user => ({
  type: SET_CURRENT_USER,
  payload: user,
});
