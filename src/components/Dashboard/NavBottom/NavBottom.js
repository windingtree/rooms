import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import RoomServiceIcon from '@material-ui/icons/RoomService'
import HotelIcon from '@material-ui/icons/Hotel'
import SyncAltIcon from '@material-ui/icons/SyncAlt'
import TrendingUpIcon from '@material-ui/icons/TrendingUp'

const useStyles = () => {
  return {
    navContainer: {
      backgroundColor: '#FFF',
    },
    nav: {
      width: '50%',
      minWidth: '24em',
    },
  }
}

class NavBottom extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      currentDashboard: this.props.currentDashboard
    }
  }

  navChange(newValue) {
    this.setState({ currentDashboard: newValue })
    this.props.onNav(newValue)
  }

  render() {
    const { classes } = this.props

    return (
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        className={classes.navContainer}
      >
        <BottomNavigation
          value={this.state.currentDashboard}
          onChange={(event, newValue) => this.navChange(newValue)}
          showLabels
          className={classes.nav}
        >
          <BottomNavigationAction label="Calendar" icon={<CalendarTodayIcon />} />
          <BottomNavigationAction label="Bookings" icon={<SyncAltIcon />} />
          <BottomNavigationAction label="Today" icon={<RoomServiceIcon />} />
          <BottomNavigationAction label="Room Types" icon={<HotelIcon />} />
          <BottomNavigationAction label="Rates" icon={<TrendingUpIcon />} />
        </BottomNavigation>
      </Grid>
    )
  }
}

export default withStyles(useStyles)(NavBottom)
