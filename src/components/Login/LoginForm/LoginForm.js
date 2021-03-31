import React from 'react'
import * as EmailValidator from 'email-validator'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import { localStorageFallback } from '../../../utils/storage_factory'
import { CONSTANTS } from '../../../utils/constants'
import { errorLogger } from '../../../utils/functions'
import { apiClient } from '../../../utils/api'
import {gaUserEvent} from "../../../utils/functions/analytics";

const {
  LOCAL_STORAGE_SESSION_EMAIL_KEY,
  LOCAL_STORAGE_SESSION_TOKEN_KEY,
} = CONSTANTS

const useStyles = () => {
  return {
    container: {
      textAlign: 'center',
    },
    loginForm: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 'calc(10px + 2vmin)',
    },
    loginTitle: {
      height: '2em',
    },
    emailInput: {
      marginBottom: '2em',
    },
    loginButton: {
      margin: '0',
      height: '4em',
      marginBottom: '0.3em',
    },
  }
}

class LoginForm extends React.Component {
  constructor(props) {
    super(props)

    this._isDestroyed = false

    this.state = {
      isEmailValid: false,
      email: '',

      canInputOneTimePassword: false,
      isOneTimePasswordValid: false,
      oneTimePassword: '',

      tryingToEmailPass: false,
      tryingToLogin: false,

      sendGridNotWorking: false,
      secondLoginOption: '',
    }
  }

  componentWillUnmount() {
    this._isDestroyed = true
  }

  emailOneTimePassClickHandler = () => {
    if (this.state.isEmailValid === false) {
      return
    }

    this.tryToEmailOneTimePass()
  }

  loginClickHandler = () => {
    if (this.state.isEmailValid === false) {
      return
    }

    this.tryToLogin()
  }

  handleOTPEditUpdate = (e) => {
    if (!e || !e.target) {
      return
    }

    const otp = e.target.value

    if (typeof otp !== 'string' || otp.length === 0) {
      return
    }

    this.setState({ oneTimePassword: otp })
    this.setState({ isOneTimePasswordValid: true })
  }

  handleOTPEditKeyUp = (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      if (this.state.isOneTimePasswordValid === false) {
        return
      }

      this.tryToLogin()
    }
  }

  handleEmailEditUpdate = (e) => {
    if (!e || !e.target) {
      return
    }

    let email = e.target.value

    if (typeof email !== 'string' || email.length === 0) {
      return
    }

    this.setState({ email })
    this.setState({ isEmailValid: EmailValidator.validate(email) })
  }

  handleEmailEditKeyUp = (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      if (this.state.isEmailValid === false) {
        return
      }

      this.tryToEmailOneTimePass()
    }
  }

  tryToEmailOneTimePass = () => {
    this.setState({
      tryingToEmailPass: true,

      sendGridNotWorking: false,
      secondLoginOption: '',
    })

    const sessionToken = localStorageFallback.getItem(LOCAL_STORAGE_SESSION_TOKEN_KEY)
    localStorageFallback.setItem(LOCAL_STORAGE_SESSION_EMAIL_KEY, this.state.email)
    gaUserEvent('one_time_password_requested')
    apiClient
      .emailOneTimePassword({ email: this.state.email, sessionToken })
      .then((response) => {
        if (this._isDestroyed) {
          return
        }

        if (response && response.oneTimePassword && response.oneTimePassword !== 'sent') {
          this.setState({ sendGridNotWorking: true, secondLoginOption: response.oneTimePassword })
        }

        this.setState({ tryingToEmailPass: false, canInputOneTimePassword: true })
      })
      .catch((error) => {
        if (this._isDestroyed) {
          return
        }

        errorLogger(error)

        this.setState({ tryingToEmailPass: false, canInputOneTimePassword: false })
      })
  }

  tryToLogin = () => {
    this.setState({ tryingToLogin: true })

    const sessionToken = localStorageFallback.getItem(LOCAL_STORAGE_SESSION_TOKEN_KEY)

    apiClient
      .login({
        email: this.state.email,
        oneTimePassword: this.state.oneTimePassword,
        sessionToken,
      })
      .then((response) => {
        if (this._isDestroyed) {
          return
        }
        console.log('success')
        this.setState({ tryingToLogin: false })
        this.props.onLogin(response)
        gaUserEvent('login_success')
      })
      .catch((error) => {
        gaUserEvent('login_failure')
        if (this._isDestroyed) {
          return
        }

        errorLogger(error)

        this.setState({ tryingToLogin: false })
      })
  }

  render() {
    const { classes } = this.props

    return (
      <div className={classes.container}>
        <header className={classes.loginForm}>
          <div className={classes.loginTitle}>Log in to Rooms</div>

          <TextField
            autoFocus
            className={classes.emailInput}
            color="secondary"
            variant="outlined"
            defaultValue={this.state.email}
            label="e-mail"
            onChange={this.handleEmailEditUpdate}
            onKeyUp={this.handleEmailEditKeyUp}
            disabled={this.state.tryingToLogin || this.state.tryingToEmailPass}
          />

          {
            (this.state.isEmailValid === true) ?

            <div className={classes.loginButton}>
              <Button
                variant="contained"
                color="primary"
                onClick={this.emailOneTimePassClickHandler}
                disabled={this.state.tryingToLogin || this.state.tryingToEmailPass}
              >
                Email Me A Password
              </Button>
            </div> :

            <div className={classes.loginButton} />
          }

          {
            (this.state.canInputOneTimePassword === true) ?

            <div className={classes.loginButton}>
              <TextField
                autoFocus
                className={classes.emailInput}
                color="secondary"
                variant="outlined"
                defaultValue={this.state.oneTimePassword}
                label="One Time Password"
                onChange={this.handleOTPEditUpdate}
                onKeyUp={this.handleOTPEditKeyUp}
                disabled={this.state.tryingToLogin || this.state.tryingToEmailPass}
              />
            </div> :

            <div className={classes.loginButton} />
          }

          {
            (this.state.isOneTimePasswordValid === true) ?

            <div className={classes.loginButton}>
              <Button
                variant="contained"
                color="primary"
                onClick={this.loginClickHandler}
                disabled={this.state.tryingToLogin || this.state.tryingToEmailPass}
              >
                Connect
              </Button>
            </div> :

            <div className={classes.loginButton} />
          }

          {
            (this.state.sendGridNotWorking === true) ?

            <div>
              <h3>SendGrid is not working. Use the following OTP:</h3>
              <h5>{this.state.secondLoginOption}</h5>
            </div> :
            <div/>
          }
        </header>
      </div>
    )
  }
}

export default withStyles(useStyles)(LoginForm)
