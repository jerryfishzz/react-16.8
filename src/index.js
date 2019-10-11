import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors' 
import { createStore, compose } from 'redux'
import reducer from './reducers'
import { Provider } from 'react-redux'

import App from './App';
import middleware from './middleware'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  reducer, 
  composeEnhancers(middleware),
)

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  overrides: {
    MuiListItem: {
      button: {
        marginTop: 4,
        marginBottom: 4,
        border: '1px solid transparent',
        borderRadius: 4,
        '&$selected': {
          border: '1px solid #3f51b5',
          borderRadius: 4,
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.08)',
          }
        }
      },
      root: {
        marginTop: 4,
        marginBottom: 4,
        border: '1px solid transparent',
        '&$selected': {
          border: '1px solid #3f51b5',
          borderRadius: 4,
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: 'transparent'
          }
        },
      },
    },
  },
})

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <App />
    </Provider>
  </MuiThemeProvider>, 
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
