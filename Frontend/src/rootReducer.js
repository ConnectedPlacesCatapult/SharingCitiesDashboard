import { combineReducers } from 'redux';

import config from './reducers/config';
import data from './reducers/data';
import editor from './reducers/editor';
import layout from './reducers/layout';
import sources from './reducers/sources';
import themes from './reducers/themes';
import user from './reducers/user';
import widgets from './reducers/widgets';

export default combineReducers({
  config,
  data,
  editor,
  layout,
  sources,
  themes,
  user,
  widgets,
});