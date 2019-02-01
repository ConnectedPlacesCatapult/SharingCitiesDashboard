import React from 'react';

// base components
import DashboardPage from './components/DashboardPage';
import DataPage from './components/DataPage';

// router
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// material-ui
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from '@material-ui/core/CssBaseline';

// redux
import { connect } from 'react-redux';
import { fetchConfig } from "./actions/configActions";

// default/fallback font
require('typeface-roboto');

// ToDo :: add a 404 (NotFoundPage) component

class App extends React.Component {
  componentDidMount() {
    const { error, fetched, fetching, fetchConfig } = this.props;

    if (!error && !fetched && !fetching) {
      fetchConfig();
    }
  }

  render() {
    const { config, fetched } = this.props;

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
          <div>
          <CssBaseline />
          <BrowserRouter>
            <Switch>
              <Route exact path="/" component={DataPage} />
              <Route path="/data" component={DataPage} />
            </Switch>
          </BrowserRouter>
          </div>
        </MuiThemeProvider>
      )
    }

    return <div>Loading...</div>
  }
}

const mapStateToProps = (state) => {
  return {
    config: state.config.config,
    error: state.config.error,
    fetched: state.config.fetched,
    fetching: state.config.fetching,
  }
};

const mapDispatchToProps = (dispatch) => ({
  fetchConfig: () => dispatch(fetchConfig()),
});

App = connect(mapStateToProps, mapDispatchToProps)(App);

export default App
