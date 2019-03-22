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
  DELETE_USER_REJECTED,
  FETCH_IMPORTER_STATUSES,
  FETCH_IMPORTER_STATUSES_FULFILLED,
  FETCH_IMPORTER_STATUSES_REJECTED,
  RERUN_IMPORTER,
  RERUN_IMPORTER_FULFILLED,
  RERUN_IMPORTER_REJECTED,
  HIDE_NOTIFICATION
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

// Fetch Importers for Importer List
export const fetchImporterStatuses = () => {
  return (dispatch) => {
    dispatch({
      type: FETCH_IMPORTER_STATUSES,
    });
    const requestData = {
      limit: '10'
    }
    axiosInstance.get('importer_status', requestData).then((response) => {
      dispatch({
        type: FETCH_IMPORTER_STATUSES_FULFILLED,
        payload: response.data,
      })
    })
    .catch((err) => {
      dispatch({
        type: FETCH_IMPORTER_STATUSES_REJECTED,
        payload: err,
      })
    })
  };
};


// Rerun Importer
export const rerunImporter = (apiID) => {
  return (dispatch) => {
    dispatch({
      type: RERUN_IMPORTER,
    });
    const requestData = {
      api_id: apiID
    }
    axiosInstance.post('importer_retry', requestData).then((response) => {
      dispatch({
        type: RERUN_IMPORTER_FULFILLED,
        payload: response.data,
      })
      setTimeout(() => {
        dispatch({
          type: HIDE_NOTIFICATION,
        })
      }, 2000)
    })
      .catch((err) => {
        dispatch({
          type: RERUN_IMPORTER_REJECTED,
          payload: err,
        })
      })
    setTimeout(() => {
        dispatch({
          type: HIDE_NOTIFICATION,
        })
      }, 2000)
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
    axiosInstance.post('admin/create_new_user', requestData).then((response) => {
      fetchUsers()(dispatch)
      dispatch({
        type: CREATE_NEW_USER_FULFILLED,
        payload: response.data,
      })
      setTimeout(() => {
        dispatch({
          type: HIDE_NOTIFICATION,
        })
      }, 2000)
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
      setTimeout(() => {
        dispatch({
          type: HIDE_NOTIFICATION,
        })
      }, 2000)
    })
    .catch((err) => {
      dispatch({
        type: DELETE_USER_REJECTED,
        payload: err,
      })
    })
  };
};