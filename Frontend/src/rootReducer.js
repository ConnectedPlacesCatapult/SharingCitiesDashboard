import { combineReducers } from 'redux';

import dashboard from './reducers/dashboard';
import editor from './reducers/editor';

export default combineReducers({
  dashboard,
  editor,
})
