import React from 'react'
import { Router, Route, Switch, Redirect, withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'

import NavTop from './NavTop/NavTop'
import NavBottom from './NavBottom/NavBottom'
import Calendar from './Calendar/Calendar'
import Bookings from './Bookings/Bookings'
import Today from './Today/Today'
import RoomTypes from './RoomTypes/RoomTypes'
import Rates from './Rates/Rates'
import { history } from '../../utils/history'

const useStyles = () => {
  return {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    main_content: {
      flex: '1',
      overflow: 'auto',
    },
    nav_bottom: {
      backgroundColor: '#FFF',
      flexGrow: 0,
    },
  }
}

class Dashboard extends React.Component {
  isLoggedIn = true

  constructor(props) {
    let currentDashboard

    super(props)

    if (!props.match.params.dashboardSectionId) {
      currentDashboard = 2
    } else {
      switch (props.match.params.dashboardSectionId) {
        case 'calendar':
          currentDashboard = 0
          break
        case 'bookings':
          currentDashboard = 1
          break
        case 'today':
          currentDashboard = 2
          break
        case 'room-types':
          currentDashboard = 3
          break
        case 'rates':
          currentDashboard = 4
          break
        default:
          currentDashboard = 5
      }
    }

    this.state = {
      currentDashboard
    }
  }

  handleOnNav(whereTo) {
    switch (whereTo) {
      case 0:
        this.props.history.push('/dashboard/calendar')
        this.setState({ currentDashboard: 0 })
        break
      case 1:
        this.props.history.push('/dashboard/bookings')
        this.setState({ currentDashboard: 1 })
        break
      case 2:
        this.props.history.push('/dashboard/today')
        this.setState({ currentDashboard: 2 })
        break
      case 3:
        this.props.history.push('/dashboard/room-types')
        this.setState({ currentDashboard: 3 })
        break
      case 4:
        this.props.history.push('/dashboard/rates')
        this.setState({ currentDashboard: 4 })
        break
      default:
        throw new Error(`Dashboard with ID ${whereTo} is not defined!`)
    }
  }

  render() {
    const { classes } = this.props

    return (
      <Router history={history}>
        <main className={classes.container}>
          <NavTop />
          <div className={classes.main_content}>
            <Switch>
              <Route exact path="/dashboard">
                <Redirect to="/dashboard/today" />
              </Route>
              <Route exact path="/dashboard/calendar">
                { this.isLoggedIn ? <Calendar /> : <Redirect to="/" /> }
              </Route>
              <Route exact path="/dashboard/bookings">
                { this.isLoggedIn ? <Bookings /> : <Redirect to="/" /> }
              </Route>
              <Route exact path="/dashboard/today">
                { this.isLoggedIn ? <Today /> : <Redirect to="/" /> }
              </Route>
              <Route exact path="/dashboard/room-types">
                { this.isLoggedIn ? <RoomTypes /> : <Redirect to="/" /> }
              </Route>
              <Route exact path="/dashboard/rates">
                { this.isLoggedIn ? <Rates /> : <Redirect to="/" /> }
              </Route>
              <Route render={() => <h1>404: page not found</h1>} />
            </Switch>
          </div>
          <div className={classes.nav_bottom}>
          <NavBottom
            currentDashboard={this.state.currentDashboard}
            onNav={(whereTo) => this.handleOnNav(whereTo)}
          />
          </div>
        </main>
      </Router>
    )
  }
}

export default withRouter(withStyles(useStyles)(Dashboard))
