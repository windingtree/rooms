import React from 'react'
import { Router, Route, Switch, Redirect, withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import * as jwt from 'jsonwebtoken'

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

function areWeLoggedIn() {
  let isLoggedIn = false
  let decodedToken = {}

  const jwtToken = window.localStorage.getItem('jwt_token')

  try {
    decodedToken = jwt.verify(jwtToken, JWT_SECRET)
  } catch (err) {
    decodedToken = {}
  }

  if (
    (typeof decodedToken.email !== 'string' || decodedToken.email.length === 0) ||
    (typeof decodedToken.oneTimePassword !== 'string' || decodedToken.oneTimePassword.length === 0)
  ) {
    isLoggedIn = false
  } else {
    isLoggedIn = true
  }

  return isLoggedIn
}

class App extends React.Component {
  constructor(props) {
    super(props)

    const isLoggedIn = areWeLoggedIn()
    if (!isLoggedIn) {
      window.localStorage.setItem('jwt_token', '')
    }

    this.state = {
      isLoggedIn
    }
  }

  handleOnLogin = (email, oneTimePassword) => {
    const token = jwt.sign({ email, oneTimePassword }, JWT_SECRET)

    window.localStorage.setItem('jwt_token', token)
    this.setState({ isLoggedIn: true })

    this.props.history.push('/dashboard')
  }

  handleLogout = () => {
    window.localStorage.setItem('jwt_token', '')
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
              <Login onLogin={this.handleOnLogin} />
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
