import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { Provider } from 'react-redux';
import rootReducer from './rootReducer';

import App from './App';

const middleware = applyMiddleware(thunk, createLogger());
const store = createStore(
  rootReducer,
  compose(
    middleware,
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);

render (
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
