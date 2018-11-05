import { combineReducers } from 'redux';

import layout from './reducers/layout';
import source from './reducers/source';
import sources from './reducers/sources';
import themes from './reducers/themes';
import user from './reducers/user';
import widgets from './reducers/widgets';

export default combineReducers({
  layout,
  source,
  sources,
  themes,
  user,
  widgets,
});
