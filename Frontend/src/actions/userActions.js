import { axiosInstance } from '../api/axios'
// import { axiosLoginInstance } from '../api/axios'
import {
  SET_CURRENT_USER,
  SET_CURRENT_USER_REJECTED,
  REQUEST_PASSWORD_FULFILLED,
  REQUEST_PASSWORD_REJECTED,
  LOGIN_REJECTED,
  CLEAR_LOGIN_ERRORS,
  REGISTER_FULFILLED,
  REGISTER_REJECTED,
  RESET_STATE,
  PROMPT_USER_DELETE,
  PASSWORD_CHANGE_FULFILLED,
  PASSWORD_CHANGE_REJECTED,
} from './../constants';
import {HIDE_CHANGE_PASSWORD, SHOW_CHANGE_PASSWORD} from "../constants";

export const login = (userCredentials, props) => {
  return (dispatch) => {
    const credentials = {
      email: userCredentials.email,
      password: userCredentials.password,
      remember: userCredentials.remember
    };

    axiosInstance.post('/login', credentials).then((response) => {
      dispatch({
        type: SET_CURRENT_USER,
        payload: response.data,
      });

      const token = response.data.access_token;
      const userName = response.data.fullname;
      const userID = response.data.id;
      const userEmail = credentials.email;
      localStorage.setItem('token', token);
      localStorage.setItem('userName', userName);
      localStorage.setItem('userID', userID);
      localStorage.setItem('userEmail', userEmail);
      props.history.push('/');
    })
      .catch((err) => {
        console.log('login failed', err);
        dispatch({
          type: LOGIN_REJECTED,
          payload: err,
        })
      })
    return true
  };
};

export const getUser = () => {
  return (dispatch) => {
    if (localStorage.getItem('userEmail')) {
      const user = {
        email: localStorage.getItem('userEmail')
      };

      axiosInstance.post('/admin/get_user_by_email', user).then((response) => {
        dispatch({
          type: SET_CURRENT_USER,
          payload: response.data,
        })
      })
        .catch((err) => {
          dispatch({
            type: SET_CURRENT_USER_REJECTED,
            payload: err,
          })
        })
    } else {
      dispatch({
        type: SET_CURRENT_USER_REJECTED,
      })
    }
  };
};

export function doRegister(userCredentials) {
  return (dispatch) => {
    const credentials = {
      email: userCredentials.email,
      fullName: userCredentials.fullName,
      password: userCredentials.password,
      password_new: userCredentials.passwordNew
    };

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

export function doPasswordChange(userCredentials) {
  return (dispatch) => {
    const credentials = {
      email: userCredentials.email,
      fullName: userCredentials.fullName,
      password: userCredentials.password,
      password_new: userCredentials.passwordNew
    };

    const session = axiosInstance.post('/register', credentials).then((response) => {
      dispatch({
        type: PASSWORD_CHANGE_FULFILLED,
        payload: response,
      })
    })
      .catch((err) => {
        dispatch({
          type: PASSWORD_CHANGE_REJECTED,
          payload: err,
        })
      })
  }
}

export const requestPassword = (email) => {
  return (dispatch) => {
    const userInfo = {
      email: email,
    };

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
};

export const clearLoginErrors = () => {
  return (dispatch) => {
    dispatch({
      type: CLEAR_LOGIN_ERRORS,
    })
  }
};

export const showChangePassword = () => {
  return (dispatch) => {
    dispatch({
      type: SHOW_CHANGE_PASSWORD
    })
  }
};

export const hideChangePassword = () => {
  return (dispatch) => {
    dispatch({
      type: HIDE_CHANGE_PASSWORD
    })
    dispatch({
      type: CLEAR_LOGIN_ERRORS
    })
  }
};

export const logout = (props) => {
  return (dispatch) => {
    localStorage.removeItem('token');
    localStorage.removeItem('fullname');
    localStorage.removeItem('id');
    props.history.push('/login');
    dispatch({
      type: RESET_STATE,
    });
  };
};
