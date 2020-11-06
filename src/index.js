import React from 'react'
import { Router } from 'react-router-dom'
import ReactDOM from 'react-dom'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

import './index.css'
import App from './components/App'
import * as serviceWorker from './serviceWorker'
import { history } from './utils/history'
import { baseMuiThemeObj } from './utils/themes'

const baseMuiTheme = createMuiTheme(baseMuiThemeObj)

const enableStrictMode = false

if (enableStrictMode === true) {
  ReactDOM.render(
    <React.StrictMode>
      <Router history={history}>
        <ThemeProvider theme={baseMuiTheme}>
          <App />
        </ThemeProvider>
      </Router>
    </React.StrictMode>,
    document.getElementById('root')
  )
} else {
  ReactDOM.render(
    <Router history={history}>
      <ThemeProvider theme={baseMuiTheme}>
        <App />
      </ThemeProvider>
    </Router>,
    document.getElementById('root')
  )
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
