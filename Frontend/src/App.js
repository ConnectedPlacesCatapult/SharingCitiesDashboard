import React from 'react';
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { CssBaseline } from '@material-ui/core';
import Dashboard from './components/Dashboard';

const FCC_CONFIG = require('./../fcc.config');
const localTheme = createMuiTheme(FCC_CONFIG.localeThemeData || {});

require('typeface-roboto');
require('./styles/fonts.css');
require('./styles/grid-overrides.css');
require('./styles/leaflet-popup-overrides.css');
require('./styles/vega-tooltip-overrides.css');

class App extends React.Component {
  render() {
    return (
      <MuiThemeProvider theme={localTheme}>
        <CssBaseline/>
        <Dashboard/>
      </MuiThemeProvider>
    )
  }
}

export default App
