import { combineReducers } from 'redux';

import config from './reducers/config';
import data from './reducers/data';
import editor from './reducers/editor';
import layout from './reducers/layout';
import themes from './reducers/themes';
import user from './reducers/user';
import widgets from './reducers/widgets';
import plot from './reducers/plot';
import vegaLite from './reducers/vegaLite';

export default combineReducers({
  config,
  data,
  editor,
  layout,
  themes,
  user,
  widgets,
  plot,
  vegaLite,
});
