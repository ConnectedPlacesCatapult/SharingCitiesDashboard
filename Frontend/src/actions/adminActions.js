import { axiosInstance } from '../api/axios'
import {
  FETCH_USERS,
  FETCH_USERS_FULFILLED,
  FETCH_USERS_REJECTED,
  CREATE_NEW_USER_FULFILLED,
  CREATE_NEW_USER_REJECTED,
  PROMPT_USER_DELETE,
  CANCEL_USER_DELETE,
  DELETE_USER_FULFILLED,
  DELETE_USER_REJECTED
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
      admin: userInfo.admin.toString()
    }
    debugger
    axiosInstance.post('admin/create_new_user', requestData).then((response) => {
      fetchUsers()(dispatch)
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

export const promptDeleteUser = (userInfo) => {
  return (dispatch) => {
    dispatch({
      type: PROMPT_USER_DELETE,
      userToDelete: userInfo
    });
  };
};

export const cancelDeleteUser = (userInfo) => {
  return (dispatch) => {
    dispatch({
      type: CANCEL_USER_DELETE,
      userToDelete: null
    });
  };
};

// Delete User
export const deleteUser = () => {
  return (dispatch, getState) => {
    const currentState = getState();
    const userObject = currentState.admin.userToDelete

    const requestData = {
      email: userObject.email
    };

    axiosInstance.post('admin/delete_user', requestData).then((response) => {
      fetchUsers()(dispatch, getState)
      dispatch({
        type: DELETE_USER_FULFILLED,
        payload: response.data,
      })
    })
    .catch((err) => {
      dispatch({
        type: DELETE_USER_REJECTED,
        payload: err,
      })
    })
  };
};