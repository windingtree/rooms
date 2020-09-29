import React from 'react'
import { Router } from 'react-router-dom'
import ReactDOM from 'react-dom'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

import './index.css'
import App from './components/App'
import * as serviceWorker from './serviceWorker'
import { history } from './utils/history'

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#ffffff',
      main: '#fff',
      dark: '#cccccc',
      contrastText: '#9e21af',
    },
    secondary: {
      // light: '#ffffff',
      light: '#ffffff',
      main: '#ffd9f3',
      dark: '#cca7c0',
      contrastText: '#000000',
    },
  },
})

ReactDOM.render(
  <React.StrictMode>
    <Router history={history}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
