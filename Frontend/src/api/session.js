export const getAuthToken = () => {
  return localStorage.getItem('token')
}
export const getUserID = () => {
  return localStorage.getItem('userID')
}
export const getUserName = () => {
  return localStorage.getItem('userName')
}