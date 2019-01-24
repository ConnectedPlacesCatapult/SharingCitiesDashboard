import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from '@material-ui/core/CssBaseline';
import { connect } from 'react-redux';
import { fetchConfig } from "./actions/configActions";

// base components
import DashboardPage from './components/dashboard/DashboardPage';
import DataPage from './components/data/DataPage';
//import VegaPage from './components/vega/VegaPage';
import PlotPage from './components/plot/PlotPage';
import TempPage from './components/temp/TempPage';
import VegaLitePage from './components/vegaLite/VegaLitePage';

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
        <div>
          <CssBaseline />
          <VegaLitePage />
        </div>
      );

      /*return (
        <MuiThemeProvider theme={localTheme}>
          <div>
          <CssBaseline />
          <TempPage />
          <BrowserRouter>
            <Switch>
              <Route exact path="/" component={DashboardPage} />
              <Route path="/data" component={DataPage} />
              <Route path="/plot" component={PlotPage} />
              <Route path="/temp" component={TempPage} />
            </Switch>
          </BrowserRouter>
          </div>
        </MuiThemeProvider>
      )*/
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

const mapDispatchToProps = {
  fetchConfig,
};

export default connect(mapStateToProps, mapDispatchToProps)(App)
