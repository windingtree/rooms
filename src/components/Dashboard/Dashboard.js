import React from 'react'
import { Router, Route, Switch, Redirect, withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'

import NavTop from './NavTop/NavTop'
import NavBottom from './NavBottom/NavBottom'
import BookingsList from './Bookings/BookingsList'
import BookingTypeEdit from './BookingTypeEdit/BookingTypeEdit'
import RoomTypes from './RoomTypes/RoomTypes'
import RoomTypeEdit from './RoomTypeEdit/RoomTypeEdit'
import Rates from './Rates/Rates'
import Profile from './Profile/Profile'
import { history } from '../../utils/history'
import RateModifierEditForm from "./RateEdit/RateEditForm";
import {Sandbox} from "../Dev/Sandbox";
import {PageView} from "../../utils/functions/analytics";

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
    super(props)

    this.state = {
      currentDashboard: this.getCurrentDashboard(),
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps &&
      prevProps.match &&
      prevProps.match.params &&

      this.props &&
      this.props.match &&
      this.props.match.params
    ) {
      if (this.props.match.params.dashboardSectionId !== prevProps.match.params.dashboardSectionId) {
        this.setState({
          currentDashboard: this.getCurrentDashboard(),
        })
      }
    }
  }

  getCurrentDashboard() {
    let currentDashboard

    if (!this.props.match.params.dashboardSectionId) {
      currentDashboard = 2
    } else {
      switch (this.props.match.params.dashboardSectionId) {
        case 'bookings':
          currentDashboard = 0
          break
        case 'room-types':
          currentDashboard = 1
          break
        case 'rates':
          currentDashboard = 2
          break
        default:
          // Maybe a valid URL, but no icon for it in bottom nav panel.
          currentDashboard = -1
      }
    }

    return currentDashboard
  }

  handleOnNav(whereTo) {
    switch (whereTo) {
      case 0:
        this.props.history.push('/dashboard/bookings')
        this.setState({ currentDashboard: 1 })
        break
      case 1:
        this.props.history.push('/dashboard/room-types')
        this.setState({ currentDashboard: 3 })
        break
      case 2:
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
          <NavTop handleLogout={this.props.handleLogout} />
          <div className={classes.main_content}>
            <Switch>
              <Route exact path="/dashboard">
                <PageView title="room-types"/>
                <Redirect to="/dashboard/room-types" />
              </Route>
              <Route exact path="/dashboard/bookings">
                <PageView title="bookings"/>
                { this.isLoggedIn ? <BookingsList userProfile={this.props.userProfile} /> : <Redirect to="/" /> }
              </Route>
              <Route exact path="/dashboard/bookings/:bookingId">
                <PageView title="bookings"/>
                { this.isLoggedIn ? <BookingTypeEdit userProfile={this.props.userProfile} /> : <Redirect to="/" /> }
              </Route>
              <Route exact path="/dashboard/room-types">
                <PageView title="roomtypes"/>
                { this.isLoggedIn ? <RoomTypes userProfile={this.props.userProfile} /> : <Redirect to="/" /> }
              </Route>
              <Route exact path="/dashboard/room-types/:roomTypeId">
                <PageView title="roomtypes"/>
                { this.isLoggedIn ? <RoomTypeEdit userProfile={this.props.userProfile} /> : <Redirect to="/" /> }
              </Route>

              <Route exact path="/dashboard/rates">
                <PageView title="rates"/>
                { this.isLoggedIn ? <Rates userProfile={this.props.userProfile} /> : <Redirect to="/" /> }
              </Route>
              <Route exact path="/dashboard/rates/:rateModifierId">
                <PageView title="rates"/>
                { this.isLoggedIn ? <RateModifierEditForm userProfile={this.props.userProfile} /> : <Redirect to="/" /> }
              </Route>
              <Route exact path="/dashboard/profile">
                <PageView title="hotel_profile"/>
                { this.isLoggedIn ? <Profile userProfile={this.props.userProfile} /> : <Redirect to="/" /> }
              </Route>
              <Route exact path="/dashboard/dev/fonts">
                <Sandbox/>
              </Route>
              <Route render={() => <><PageView title="404_not_found"/><h1>404: page not found</h1></>} />
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
