//import axios from 'axios';
import { SET_CURRENT_DATASOURCE } from "./types";

export function setCurrentDatasource(datasource) {
  return {
    type: SET_CURRENT_DATASOURCE,
    datasource
  };
}



/*export function getData(params) {

}

export function setData(data) {

}

export function login(data) {
  return dispatch => {
    return axios.post('/api/auth', params).then(res => {
      const token = res.data.token;
      localStorage.setItem('jwtToken', token);
      setAuthorizationToken(token);
      dispatch(setCurrentUser(jwtDecode(token)));
    });
  }
}*/
