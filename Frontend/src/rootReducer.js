import { combineReducers } from 'redux';

import api from './reducers/api';
import notifications from './reducers/notifications';
import config from './reducers/config';
import dashboard from './reducers/dashboard';
import admin from './reducers/admin';
import user from './reducers/user';
import widget from './reducers/widget';

export default combineReducers({
  api,
  config,
  dashboard,
  notifications,
  admin,
  user,
  widget,
})
