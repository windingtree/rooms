import React from 'react'
import { Router, Route, Switch, Redirect, withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'

import OnBoarding from './OnBoarding/OnBoarding'
import Login from './Login/Login'
import Dashboard from './Dashboard/Dashboard'
import { history } from '../utils/history'

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
  isLoggedIn = true

  handleOnLogin() {
    this.props.history.push('/dashboard/today')
  }

  render() {
    const { classes } = this.props

    return (
      <Router history={history}>
        <main className={classes.container}>
          <Switch>
            <Route exact path="/">
              <OnBoarding onLogin={() => this.handleOnLogin()} />
            </Route>
            <Route exact path="/login" component={Login} />
            <Route exact path="/dashboard">
              { this.isLoggedIn ? <Dashboard /> : <Redirect to="/" /> }
            </Route>
            <Route path={`/dashboard/:dashboardSectionId`}>
              { this.isLoggedIn ? <Dashboard /> : <Redirect to="/" /> }
            </Route>
            <Route render={() => <h1>404: page not found</h1>} />
          </Switch>
        </main>
      </Router>
    )
  }
}

export default withRouter(withStyles(useStyles)(App))
