import { combineReducers } from 'redux';

import source from './reducers/source';
import sources from './reducers/sources';
import themes from './reducers/themes';
import user from './reducers/user';
import widget from './reducers/widget';
import widgets from './reducers/widgets';

export default combineReducers({
  source,
  sources,
  themes,
  user,
  widget,
  widgets,
});
