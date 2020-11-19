import React from 'react'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const useStyles = () => {
  return {
    container: {
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: '100%',      
    },
    spacer: {
      flex: 1,
    },
    mainFlow: {
      height: '16em',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 'calc(10px + 2vmin)',
    },
    questionForm: {
      height: '2em',
    },
    LoginBtn: {
      width: '5em',
    },
  }
}

class OnBoarding extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showOnBoarding: false,
    }
  }

  loginClickHandler = () => {
    this.props.history.push('/login')
  }

  render() {
    const { classes } = this.props

    return (
      <div className={classes.container}>
        { this.state.showOnBoarding ?
          <header className={classes.mainFlow}>
            <div className={classes.questionForm}>Pick up in mind any room in your hotel</div>
            <Button variant="contained" color="primary">
              OK
            </Button>
          </header> :
          <div />
        }
        <div className={classes.spacer} />
        <Button className={classes.LoginBtn} variant="contained" color="secondary" onClick={this.loginClickHandler}>
          Login
        </Button>
        <div className={classes.spacer} />
      </div>
    )
  }
}

export default withRouter(withStyles(useStyles)(OnBoarding))
