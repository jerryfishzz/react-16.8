import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors' 

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    secondary: {
      main: blue[50],
    }
  },
  spacing: {
    unit: 10
  }
})

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
     <App />
  </MuiThemeProvider>, 
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
