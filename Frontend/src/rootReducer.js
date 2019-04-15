import { combineReducers } from 'redux';

import admin from './reducers/admin';
import dashboard from './reducers/dashboard';
import dataTable from './reducers/dataTable';
import editor from './reducers/editor';
import notifications from './reducers/notifications';
import user from './reducers/user';

export default combineReducers({
  admin,
  dashboard,
  dataTable,
  editor,
  notifications,
  user,
})
