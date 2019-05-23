import React from 'react';
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { CssBaseline } from '@material-ui/core';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import SnackBar from "./components/common/SnackBar/SnackBar";
import AdminPage from './components/AdminPage';
import ChangePasswordModal from './components/common/ChangePasswordModal';
import DashboardPage from './components/Dashboard';
import DataPage from './components/DataPage';
import LoginPage from './components/LoginPage';

const FCC_CONFIG = require('./../fcc.config');
const localTheme = createMuiTheme(FCC_CONFIG.localeThemeData || {});

require('typeface-roboto');
require('./styles/fonts.css');
require('./styles/grid-overrides.css');
require('./styles/leaflet-popup-overrides.css');
require('./styles/vega-tooltip-overrides.css');

class App extends React.Component {
  
  render() {
    const { notifications } = this.props;
    return (
      <MuiThemeProvider theme={localTheme}>
        <CssBaseline />
        <SnackBar notification={notifications}/>
        <ChangePasswordModal/>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={DashboardPage} />
            <Route path="/data" component={DataPage} />
            <Route path="/admin" component={AdminPage} />
            <Route path="/login" component={LoginPage} />
          </Switch>
        </BrowserRouter>
      </MuiThemeProvider>
    )
  }
}

const mapStateToProps = (state) => ({
  notifications: state.notifications
});

App = connect(mapStateToProps, null)(App);

export default App
