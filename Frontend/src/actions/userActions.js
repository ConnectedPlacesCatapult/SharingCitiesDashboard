import axios from 'axios';
import setAuthorizationToken from '../utils/setAuthorizationToken';
import jwtDecode from 'jwt-decode';

import { SET_CURRENT_USER } from './../constants';
import {FETCH_CONFIG, FETCH_CONFIG_FULFILLED, FETCH_CONFIG_REJECTED} from "../constants";

export function doLogin(email, password) {
  console.log("credentials", email, password)
}

// export const doLogin = credentials => {
  // return (dispatch, getState) => {
  //   return axios.post('/api/auth', data).then(res => {
  //     const token = res.data.token;
  //
  //     localStorage.setItem('jwtToken', token);
  //
  //     setAuthorizationToken(token);
  //
  //     dispatch(setCurrentUser(jwtDecode(token)));
  //   });
  // }
// };

export const doLogout = () => {
  return (dispatch, getState) => {
    localStorage.removeItem('jwtToken');

    setAuthorizationToken(false);

    dispatch(setCurrentUser({}));
  }
};

export const setCurrentUser = user => ({
  type: SET_CURRENT_USER,
  payload: user,
});
