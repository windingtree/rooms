import React from 'react'
import { withRouter } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'

import { apiClient } from '../../../utils/api/client'

class SendGridRedirect extends React.Component {
  constructor(props) {
    super(props)

    this._isDestroyed = false
    this.state = {
      oneTimePassword: props.match.params.oneTimePassword,
    }
  }

  componentDidMount() {
    this.tryToLogin(this.state.oneTimePassword)
  }

  componentWillUnmount() {
    this._isDestroyed = true
  }

  tryToLogin = (oneTimePassword) => {
    const sessionToken = window.localStorage.getItem('session_token')
    const email = window.localStorage.getItem('session_email')

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
      .catch((err) => {
        this.props.onLogout()
        this.props.history.push('/login')
      })
  }

  render() {
    return (
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        {this.state.oneTimePassword}
      </Grid>
    )
  }
}

export default withRouter(SendGridRedirect)
