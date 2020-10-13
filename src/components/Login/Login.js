import React from 'react'
import { Router, Route, Switch, withRouter } from 'react-router-dom'

import LoginForm from './LoginForm/LoginForm'
import SendGridRedirect from './SendGridRedirect/SendGridRedirect'
import { history } from '../../utils/history'

class Login extends React.Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route exact path="/login">
            <LoginForm onLogin={this.props.onLogin} onLogout={this.props.onLogout} />
          </Route>
          <Route exact path="/login/:oneTimePassword">
            <SendGridRedirect onLogin={this.props.onLogin} onLogout={this.props.onLogout} />
          </Route>
        </Switch>
      </Router>
    )
  }
}

export default withRouter(Login)
