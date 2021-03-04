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

const useStyles = (theme) => {
  return {
    root: {
      width: '10vw',
      color: theme.palette.secondary.main,
      '&$selected': {
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.contrastText,
      },
      minWidth: '64px'
    },
    label: {
      fontSize: '0.72rem',
      '&$selected': {
        fontSize: '0.75rem',
      }
    },
    selected: {
      // This is left empty. Override default "selected" styles.
    },
  }
}

class NavBottom extends React.Component {
  navChange = (event, newValue) => {
    this.props.onNav(newValue)
  }

  iconColor = (id) => {
    if (id === this.props.currentDashboard) {
      return 'primary'
    } else {
      return 'action'
    }
  }

  render() {
    const { classes } = this.props

    return (
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
      >
        <BottomNavigation
          value={this.props.currentDashboard}
          onChange={this.navChange}
          showLabels
        >
          <BottomNavigationAction
            classes={classes}
            label="Calendar"
            icon={<CalendarTodayIcon color={this.iconColor(0)} />}
          />
          <BottomNavigationAction
            classes={classes}
            label="Bookings"
            icon={<SyncAltIcon color={this.iconColor(1)} />}
          />
          <BottomNavigationAction
            classes={classes}
            label="Today"
            icon={<RoomServiceIcon color={this.iconColor(2)} />}
          />
          <BottomNavigationAction
            classes={classes}
            label="Room Types"
            icon={<HotelIcon color={this.iconColor(3)} />}
          />
          <BottomNavigationAction
            classes={classes}
            label="Rates"
            icon={<TrendingUpIcon color={this.iconColor(4)} />}
          />
        </BottomNavigation>
      </Grid>
    )
  }
}

export default withStyles(useStyles)(NavBottom)
