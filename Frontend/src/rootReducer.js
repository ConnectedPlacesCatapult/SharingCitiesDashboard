import { combineReducers } from 'redux';

import config from './reducers/config';
import layout from './reducers/layout';
import source from './reducers/source';
import sources from './reducers/sources';
import themes from './reducers/themes';
import user from './reducers/user';
import widgets from './reducers/widgets';

export default combineReducers({
  config,
  layout,
  source,
  sources,
  themes,
  user,
  widgets,
});
