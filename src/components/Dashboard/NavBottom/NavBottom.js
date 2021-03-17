import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import HotelIcon from '@material-ui/icons/Hotel'
import SyncAltIcon from '@material-ui/icons/SyncAlt'
import TrendingUpIcon from '@material-ui/icons/TrendingUp'
import {PageContentWrapper} from "../../base/Common/PageContentWrapper";

const useStyles = (theme) => {
  return {
    root: {
      color: theme.palette.secondary.main,
      '&$selected': {
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.contrastText,
      },
    },
    label: {
      fontSize: '0.72rem',
      '&$selected': {
        fontSize: '0.75rem',
      },
      color:'black'
    },
    selected: {
      color:'white'
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
        <PageContentWrapper>
        <BottomNavigation
          value={this.props.currentDashboard}
          onChange={this.navChange}
          showLabels
        >
          <BottomNavigationAction
            classes={classes}
            label="Bookings"
            icon={<SyncAltIcon color={this.iconColor(0)} />}
          />
          <BottomNavigationAction
            classes={classes}
            label="Room Types"
            icon={<HotelIcon color={this.iconColor(1)} />}
          />
          <BottomNavigationAction
            classes={classes}
            label="Rates"
            icon={<TrendingUpIcon color={this.iconColor(2)} />}
          />
        </BottomNavigation>
        </PageContentWrapper>
    )
  }
}

export default withStyles(useStyles)(NavBottom)
