import { LOCAL_URL } from './urls'
import { getAuthToken } from './session'
import axios from 'axios'


export const axiosInstance = axios.create({
  baseURL: LOCAL_URL
})

axiosInstance.interceptors.request.use(function (config) {
  // Do something before request is sent
  const authToken = getAuthToken()
  config.headers.Authorization = 'Bearer ' + authToken
  return config
})

// const cachedInstance = axiosInstance

// export default instance
// export default axiosInstance
