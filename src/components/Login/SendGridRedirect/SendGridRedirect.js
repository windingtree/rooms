import React from 'react'
import { withRouter } from 'react-router-dom'

import { apiClient } from '../../../utils/api'
import Spinner from '../../base/Spinner/Spinner'
import { errorLogger } from '../../../utils/functions'

class SendGridRedirect extends React.Component {
  constructor(props) {
    super(props)

    this._isDestroyed = false
    this.state = {
      oneTimePassword: props.match.params.oneTimePassword,
    }
  }

  componentDidMount() {
    this.tryToLogin()
  }

  componentWillUnmount() {
    this._isDestroyed = true
  }

  tryToLogin = () => {
    const email = window.localStorage.getItem('session_email')
    const oneTimePassword = this.state.oneTimePassword
    const sessionToken = window.localStorage.getItem('session_token')

    apiClient
      .login({
        email,
        oneTimePassword,
        sessionToken,
      })
      .then((response) => {
        if (this._isDestroyed) {
          return
        }

        this.props.onLogin(response.email, response.oneTimePassword)
      })
      .catch((error) => {
        if (this._isDestroyed) {
          return
        }

        errorLogger(error)

        this.props.onLogout()
        this.props.history.push('/login')
      })
  }

  render() {
    return (
      <Spinner info="authenticating" />
    )
  }
}

export default withRouter(SendGridRedirect)
