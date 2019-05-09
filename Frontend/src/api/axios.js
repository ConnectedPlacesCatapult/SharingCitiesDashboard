import { getAuthToken } from './session'
import axios from 'axios'


export const axiosInstance = axios.create({
  baseURL: `${process.env.NODE_HOST}${process.env.API_PORT}`
})

export const axiosLoginInstance = axios.create({
  baseURL: `${process.env.API_HOST}`
})

axiosInstance.interceptors.request.use(function (config) {
  // Do something before request is sent
  const authToken = getAuthToken()
  config.headers.Authorization = 'Bearer ' + authToken
  return config
})

axiosLoginInstance.interceptors.request.use(function (config) {
  // Do something before request is sent
  const authToken = getAuthToken()
  config.headers.Authorization = 'Bearer ' + authToken
  return config
})

// const cachedInstance = axiosInstance

// export default instance
// export default axiosInstance