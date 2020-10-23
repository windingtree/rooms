import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import SearchIcon from '@material-ui/icons/Search'
import HomeIcon from '@material-ui/icons/Home'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { Link } from 'react-router-dom'

const useStyles = (theme) => {
  return {
    grow: {
      flexGrow: 1,
    },
    title: {
      display: 'block',
    },
    sectionIcons: {
      display: 'flex',
    },
    link: {
      color: theme.palette.primary.contrastText,
      '&:hover': {
        color: theme.palette.primary.contrastText,
      },
    },
  }
}

class NavTop extends React.Component {
  render() {
    const { classes } = this.props

    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography className={classes.title} variant="h6" noWrap>
              Rooms
            </Typography>
            <div className={classes.grow} />
            <div className={classes.sectionIcons}>
              <IconButton color="inherit">
                <SearchIcon />
              </IconButton>
              <Link to="/dashboard/profile" className={classes.link}>
                <IconButton color="inherit">
                  <HomeIcon />
                </IconButton>
              </Link>
              <IconButton color="inherit" onClick={this.props.handleLogout}>
                <ExitToAppIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

export default withStyles(useStyles)(NavTop)
