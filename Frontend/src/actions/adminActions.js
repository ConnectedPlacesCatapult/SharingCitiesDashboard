import { axiosInstance } from '../api/axios'
import {
  FETCH_USERS,
  FETCH_USERS_FULFILLED,
  FETCH_USERS_REJECTED,
  CREATE_NEW_USER_FULFILLED,
  CREATE_NEW_USER_REJECTED
} from "./../constants";

// Fetch Users for User List
export const fetchUsers = () => {
  return (dispatch) => {
    dispatch({
      type: FETCH_USERS,
    });
    const requestData = {
      limit: '10'
    }
    axiosInstance.post('admin/list_users', requestData).then((response) => {
      dispatch({
        type: FETCH_USERS_FULFILLED,
        payload: response.data,
      })
    })
    .catch((err) => {
      dispatch({
        type: FETCH_USERS_REJECTED,
        payload: err,
      })
    })
  };
};

// Add User
export const createUser = (userInfo) => {
  return (dispatch) => {
    const requestData = {
      email: userInfo.email,
      fullname: userInfo.fullName,
      password: userInfo.password,
      admin: userInfo.isAdmin.toString()
    }
    axiosInstance.post('admin/create_new_user', requestData).then((response) => {
      dispatch({
        type: CREATE_NEW_USER_FULFILLED,
        payload: response.data,
      })
    })
    .catch((err) => {
      dispatch({
        type: CREATE_NEW_USER_REJECTED,
        payload: err,
      })
    })
  };
};