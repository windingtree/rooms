import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import SearchIcon from '@material-ui/icons/Search'
import HomeIcon from '@material-ui/icons/Home'
import { Link } from 'react-router-dom'

const useStyles = () => {
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
      color: '#FFF',
      '&:hover': {
        color: '#FFF',
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
              <Link to="../" className={classes.link}>
                <IconButton color="inherit">
                  <HomeIcon />
                </IconButton>
              </Link>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

export default withStyles(useStyles)(NavTop)
