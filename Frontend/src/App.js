import React from 'react';

// base components
import DashboardPage from './components/DashboardPage';
import DataPage from './components/DataPage';
import LoginPage from './components/LoginPage';
import AdminPage from './components/AdminPage';

// router
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// material-ui
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from '@material-ui/core/CssBaseline';
import SnackBar from "./components/common/SnackBar/SnackBar"

// redux
import { connect } from 'react-redux';
import { fetchConfig } from "./actions/configActions";

var express = require('express')
var cors = require('cors')
var app = express()

app.use(cors())

app.get('/products/:id', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
})

app.listen(80, function () {
  console.log('CORS-enabled web server listening on port 80')
})

// default/fallback font
require('typeface-roboto');

// ToDo :: add a 404 (NotFoundPage) component

class App extends React.Component {
  componentDidMount() {
    const { error, fetched, fetching, fetchConfig, state } = this.props;

    if (!error && !fetched && !fetching) {
      fetchConfig();
    }
  }

  render() {
    const { config, fetched, notifications } = this.props;

    if (fetched) {
      // load local stylesheet if not null
      if (config.localeStyleSheet) {
        let localStylesheet = config.localeStyleSheet;
        require(`${localStylesheet}`);
      }

      // customise default MUI theme
      const localTheme = createMuiTheme(config.localeThemeData || {});

      return (
        <MuiThemeProvider theme={localTheme}>
          <SnackBar notification={notifications}/>
          <div>
          <CssBaseline />
          <BrowserRouter>
            <Switch>
              <Route exact path="/" component={DashboardPage} />
              <Route path="/data" component={DataPage} />
              <Route path="/admin" component={AdminPage} />
              <Route path="/login" component={LoginPage} />
            </Switch>
          </BrowserRouter>
          </div>
        </MuiThemeProvider>
      )
    }

    return <div>Loading...</div>
  }
}

const mapStateToProps = (state) => ({
  config: state.config.config,
  error: state.config.error,
  fetched: state.config.fetched,
  fetching: state.config.fetching,
  notifications: state.notifications
});

const mapDispatchToProps = (dispatch) => ({
  fetchConfig: () => dispatch(fetchConfig()),
});

App = connect(mapStateToProps, mapDispatchToProps)(App);

export default App
