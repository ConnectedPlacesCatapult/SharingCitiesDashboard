import { getAuthToken } from './session'
import axios from 'axios'


export const axiosInstance = axios.create({
  baseURL: `${process.env.API_HOST}`
})

// export const axiosLoginInstance = axios.create({
//   baseURL: '<<api-address>>'
// })

axiosInstance.interceptors.request.use(function (config) {
  // Do something before request is sent
  const authToken = getAuthToken()
  config.headers.Authorization = 'Bearer ' + authToken
  return config
})

// axiosLoginInstance.interceptors.request.use(function (config) {
//   // Do something before request is sent
//   const authToken = getAuthToken()
//   config.headers.Authorization = 'Bearer ' + authToken
//   return config
// })

// const cachedInstance = axiosInstance

// export default instance
// export default axiosInstance
