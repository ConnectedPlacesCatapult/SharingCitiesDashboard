import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import registerServiceWorker from './registerServiceWorker';

// body css
import './index.css';

// localisation
import './styles/portugal.css';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#95E5CC',
      main: '#81C3AE',
      dark: '#6AA08E'
    },
    secondary: {
      light: '#FC554B',
      main: '#D54A44',
      dark: '#AE3C38'
    }
  },
  typography: {
    fontFamily: "'BrandonText', 'Roboto', 'Helvetica', 'Arial', sans-serif",
  }
});

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <App />
  </MuiThemeProvider>,
  document.getElementById('root')
);

registerServiceWorker();