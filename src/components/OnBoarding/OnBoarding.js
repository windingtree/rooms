import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const useStyles = () => {
  return {
    container: {
      textAlign: 'center',
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
    }
  }
}

class OnBoarding extends React.Component {
  onLogin() {
    this.props.onLogin()
  }

  render() {
    const { classes } = this.props

    return (
      <div className={classes.container}>
        <header className={classes.mainFlow}>
          <div className={classes.questionForm}>Pick up in mind any room in your hotel</div>
          <Button variant="contained" color="primary">
            OK
          </Button>
        </header>
        <Button color="primary" onClick={() => {this.onLogin()}}>
          Login
        </Button>
      </div>
    )
  }
}

export default withStyles(useStyles)(OnBoarding)
