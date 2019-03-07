import { axiosInstance } from '../api/axios'
import { SET_CURRENT_USER } from './../constants';

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

export function doRegister(email, fullName, password, passwordNew) {
  const userInfo = {
    email: email,
    fullName: fullName,
    password: password,
    password_new: passwordNew
  }
  const session = axiosInstance.post('/register', userInfo).then((res) => {
  }).catch(function (e) {
    console.log('registration failed', e)
  })
}

export function doLogout(props) {
  localStorage.removeItem('token');
  localStorage.removeItem('fullname');
  localStorage.removeItem('id');
  props.history.push('/login')
}
