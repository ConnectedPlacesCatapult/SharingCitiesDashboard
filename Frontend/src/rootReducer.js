import { combineReducers } from 'redux';

//import auth from './reducers/auth';
import datasource from './reducers/datasource';
import theme from './reducers/theme';
import widget from './reducers/widget';

export default combineReducers({
  //auth,
  datasource,
  theme,
});
