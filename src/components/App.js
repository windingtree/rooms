import React from 'react'
import { Router, Route, Switch, Redirect, withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import * as jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

import { ApiCache } from '../utils/api_cache'
import { apiClient } from '../utils/api'
import { errorLogger } from '../utils/functions'
import OnBoarding from './OnBoarding/OnBoarding'
import Login from './Login/Login'
import Dashboard from './Dashboard/Dashboard'
import { history } from '../utils/history'

const JWT_SECRET = process.env.REACT_APP_JWT_SECRET

const useStyles = () => {
  return {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
  }
}

class App extends React.Component {
  constructor(props) {
    super(props)

    this._isDestroyed = false

    this.apiCache = ApiCache.getInstance()

    const isLoggedIn = this.areWeLoggedIn()
    if (!isLoggedIn) {
      this.resetLocalStorage(false)
    }

    const profileId = this.getProfileIdFromCache()

    this.state = {
      isLoggedIn,
      profileId,
    }
  }

  componentDidMount = () => {
    if (typeof window.__global_logout_method === 'undefined') {
      window.__global_logout_method = () => {
        this.handleLogout()
      }
    }

    this.getProfile()
  }

  componentWillUnmount = () => {
    if (typeof window.__global_logout_method !== 'undefined') {
      window.__global_logout_method = undefined
      delete window.__global_logout_method
    }

    this._isDestroyed = true
  }

  getProfileIdFromCache = () => {
    let profileId = ''

    const profile = this.apiCache.getProfile()

    if (profile && profile.id) {
      profileId = profile.id
    }

    return profileId
  }

  getProfile = () => {
    if (typeof this.state.profileId !== 'string' || this.state.profileId.length === 0) {
      this.handleLogout()
      return
    }

    apiClient
      .getProfile(this.state.profileId)
      .then((profile) => {
        if (this._isDestroyed) return

        this.setState({
          profileId: profile.id,
        })
      })
      .catch((error) => {
        if (this._isDestroyed) return

        errorLogger(error)
      })
  }

  handleOnLogin = (email, oneTimePassword) => {
    const sessionToken = window.localStorage.getItem('session_token')
    const token = jwt.sign({ email, oneTimePassword, sessionToken }, JWT_SECRET)

    window.localStorage.setItem('jwt_token', token)

    const profileId = this.getProfileIdFromCache()

    this.setState({ isLoggedIn: true, profileId })

    this.props.history.push('/dashboard')
  }

  areWeLoggedIn = () => {
    let isLoggedIn = false
    let decodedToken = {}

    const jwtToken = window.localStorage.getItem('jwt_token')
    const sessionToken = window.localStorage.getItem('session_token')

    try {
      decodedToken = jwt.verify(jwtToken, JWT_SECRET)
    } catch (err) {
      decodedToken = {}
    }

    if (
      (typeof decodedToken.email !== 'string' || decodedToken.email.length === 0) ||
      (typeof decodedToken.oneTimePassword !== 'string' || decodedToken.oneTimePassword.length === 0) ||
      (typeof decodedToken.sessionToken !== 'string' || decodedToken.sessionToken.length === 0) ||
      (typeof sessionToken !== 'string' || sessionToken.length === 0) ||
      (sessionToken !== decodedToken.sessionToken)
    ) {
      isLoggedIn = false
    } else {
      isLoggedIn = true
    }

    return isLoggedIn
  }

  resetLocalStorage = (refreshSessionToken) => {
    this.apiCache.clearCache()
    window.localStorage.setItem('jwt_token', '')

    const sessionToken = window.localStorage.getItem('session_token')
    if (
      (typeof sessionToken !== 'string') ||
      (sessionToken.length === 0) ||
      (refreshSessionToken === true)
    ) {
      window.localStorage.setItem('session_token', uuidv4())
    }
  }

  handleLogout = () => {
    this.resetLocalStorage(true)
    this.setState({ isLoggedIn: false })
  }

  render() {
    const { classes } = this.props

    return (
      <Router history={history}>
        <main className={classes.container}>
          <Switch>
            <Route exact path="/">
              { !this.state.isLoggedIn ? <OnBoarding/> : <Redirect to="/dashboard" /> }
            </Route>
            <Route exact path="/login">
              <Login onLogin={this.handleOnLogin} onLogout={this.handleLogout} />
            </Route>
            <Route exact path="/login/:oneTimePassword">
              <Login onLogin={this.handleOnLogin} onLogout={this.handleLogout} />
            </Route>
            <Route exact path="/dashboard">
              { this.state.isLoggedIn ?
                <Dashboard handleLogout={this.handleLogout} /> :
                <Redirect to="/" />
              }
            </Route>
            <Route path={`/dashboard/:dashboardSectionId`}>
              { this.state.isLoggedIn ?
                <Dashboard handleLogout={this.handleLogout} /> :
                <Redirect to="/" />
              }
            </Route>
            <Route render={() => <h1>404: page not found</h1>} />
          </Switch>
        </main>
      </Router>
    )
  }
}

export default withRouter(withStyles(useStyles)(App))
