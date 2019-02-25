import { combineReducers } from 'redux';

import api from './reducers/api';
import config from './reducers/config';
import dashboard from './reducers/dashboard';
import user from './reducers/user';
import widget from './reducers/widget';

export default combineReducers({
  api,
  config,
  dashboard,
  user,
  widget,
})
