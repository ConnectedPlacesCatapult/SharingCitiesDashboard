import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

// reducer(s)
import rootReducer from './rootReducer';

// base components
import Header from './components/common/Header';
import DashboardPage from './components/dashboard/DashboardPage';
import DataPage from './components/data/DataPage';
import BuilderPage from './components/builder/BuilderPage';

// page components
//const pages = { DashboardPage, DataPage, BuilderPage };

// default/fallback font
require('typeface-roboto');

// locale config
// ToDo :: prettier way of doing this?
import { localeStyleSheet, localeThemeData, routes } from './../fcc.config';
const localTheme = createMuiTheme(localeThemeData);

// redux store
const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);

// ToDo :: add a 404 (NotFoundPage) component

/*const pageRoutes = routes.map((route, i) => {
  return (
    <Route
      key={i}
      exact={route.exact}
      path={route.path}
      component={pages[route.component]}
    />
  )
});*/

render(
  <Provider store={store}>
    <React.Fragment>
      <CssBaseline />
      <MuiThemeProvider theme={localTheme}>
        <Router>
          <React.Fragment>
            <Route component={Header} />
            <Switch>
              <Route exact path="/" component={ DashboardPage } />
              <Route path="/data" component={ DataPage } />
              <Route path="/build" component={ BuilderPage } />
              {/*{ pageRoutes }*/}
            </Switch>
          </React.Fragment>
        </Router>
      </MuiThemeProvider>
    </React.Fragment>
  </Provider>,
  document.getElementById("root")
);
