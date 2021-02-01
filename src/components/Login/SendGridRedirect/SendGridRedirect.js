import React from 'react'
import { withRouter } from 'react-router-dom'

import { localStorageFallback } from '../../../utils/storage_factory'
import { CONSTANTS } from '../../../utils/constants'
import { apiClient } from '../../../utils/api'
import Spinner from '../../base/Spinner/Spinner'
import { errorLogger } from '../../../utils/functions'

const {
  LOCAL_STORAGE_SESSION_TOKEN_KEY,
  LOCAL_STORAGE_SESSION_EMAIL_KEY,
} = CONSTANTS

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
    const email = localStorageFallback.getItem(LOCAL_STORAGE_SESSION_EMAIL_KEY)
    const oneTimePassword = this.state.oneTimePassword
    const sessionToken = localStorageFallback.getItem(LOCAL_STORAGE_SESSION_TOKEN_KEY)

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

        this.props.onLogin(response)
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
