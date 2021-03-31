import React from 'react'
import { Router, Route, Switch, Redirect, withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import * as jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

import { localStorageFallback } from '../utils/storage_factory'
import { CONSTANTS } from '../utils/constants'
import { ApiCache } from '../utils/api_cache'
import { apiClient } from '../utils/api'
import { errorLogger } from '../utils/functions'
import OnBoarding from './OnBoarding/OnBoarding'
import Login from './Login/Login'
import Dashboard from './Dashboard/Dashboard'
import { history } from '../utils/history'
import Spinner from './base/Spinner/Spinner'
import {gaUserEvent, PageView} from "../utils/functions/analytics";

const {
  JWT_SECRET,
  LOCAL_STORAGE_SESSION_TOKEN_KEY,
  LOCAL_STORAGE_JWT_TOKEN_KEY,
  LOCAL_STORAGE_SESSION_EMAIL_KEY,
} = CONSTANTS

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

    const sessionToken = localStorageFallback.getItem(LOCAL_STORAGE_SESSION_TOKEN_KEY)
    if (typeof sessionToken !== 'string' || sessionToken.length === 0) {
      this.resetLocalStorage()
    }

    let profile = this.apiCache.getProfile()
    let profileId

    if (profile && profile.id) {
      profileId = profile.id
    } else {
      profile = null
      profileId = null
    }

    this.state = {
      isLoggedIn: false,
      loadingProfile: true,
      profile,
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

  getProfile = () => {
    if (typeof this.state.profileId !== 'string' || this.state.profileId.length === 0) {
      this.setState({
        loadingProfile: false,
        profile: null,
        profileId: null,
      })

      return
    }

    apiClient
      .getProfile(this.state.profileId)
      .then((profile) => {
        if (this._isDestroyed) return

        this.setState({
          isLoggedIn: true,
          loadingProfile: false,
          profile,
          profileId: profile.id,
        })
      })
      .catch((error) => {
        if (this._isDestroyed) return
        console.log('@@@@', error);

        errorLogger(error)
      })
  }

  handleOnLogin = (profile) => {
    const sessionToken = localStorageFallback.getItem(LOCAL_STORAGE_SESSION_TOKEN_KEY)
    const token = jwt.sign({ email: profile.email, oneTimePassword: profile.oneTimePassword, sessionToken }, JWT_SECRET)

    localStorageFallback.setItem(LOCAL_STORAGE_JWT_TOKEN_KEY, token)

    this.setState({
      isLoggedIn: true,
      profileId: profile.id,
      profile,
    })

    this.props.history.push('/dashboard')
  }

  resetLocalStorage = () => {
    this.apiCache.clearCache()

    localStorageFallback.setItem(LOCAL_STORAGE_SESSION_EMAIL_KEY, '')
    localStorageFallback.setItem(LOCAL_STORAGE_JWT_TOKEN_KEY, '')
    localStorageFallback.setItem(LOCAL_STORAGE_SESSION_TOKEN_KEY, uuidv4())
  }

  handleLogout = () => {
    this.resetLocalStorage()
    gaUserEvent('logout')
    this.setState({
      isLoggedIn: false,
      loadingProfile: false,
      profile: null,
      profileId: null,
    })
  }

  render() {
    const { classes } = this.props

    return (
      <Router history={history}>
        <main className={classes.container}>
          {
            (this.state.loadingProfile) ?
              <Spinner info="loading" /> :
              <Switch>
                <Route exact path="/">
                  <PageView title="/"/>
                  { !this.state.isLoggedIn ? <OnBoarding/> : <Redirect to="/dashboard" /> }
                </Route>
                <Route exact path="/login">
                  <PageView title="login"/>
                  <Login onLogin={this.handleOnLogin} onLogout={this.handleLogout} />
                </Route>
                <Route exact path="/login/:oneTimePassword">
                  <PageView title="login_one_time_password"/>
                  <Login onLogin={this.handleOnLogin} onLogout={this.handleLogout} />
                </Route>
                <Route exact path="/dashboard">
                  <PageView title="dashboard"/>
                  { this.state.isLoggedIn ?
                    <Dashboard userProfile={this.state.profile} handleLogout={this.handleLogout} /> :
                    <Redirect to="/" />
                  }
                </Route>
                <Route path={`/dashboard/:dashboardSectionId`}>
                  { this.state.isLoggedIn ?
                    <Dashboard userProfile={this.state.profile} handleLogout={this.handleLogout} /> :
                    <Redirect to="/" />
                  }
                </Route>
                <Route render={() => <><PageView title="404_not_found"/><h1>404: page not found</h1></>} />
              </Switch>
          }
        </main>
      </Router>
    )
  }
}

export default withRouter(withStyles(useStyles)(App))
