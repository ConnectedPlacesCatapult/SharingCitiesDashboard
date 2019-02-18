import { LOCAL_URL } from './urls'
import axios from 'axios'
// import { getAuthToken } from '../mixins/session'
// import { getActiveSite } from '../mixins/session'
// import cachedAxios from './cached_axios'

export const axiosInstance = axios.create({
  baseURL: LOCAL_URL
})

axiosInstance.interceptors.request.use(function (config) {
  // Do something before request is sent
  // const authToken = getAuthToken()
  // const activeSite = getActiveSite()
  // config.headers.Authorization = 'Token ' + authToken
  // if (activeSite) {
  //   config.headers.site = activeSite
  // }
  return config
})

// const cachedInstance = axiosInstance

// export default instance
// export default axiosInstance
