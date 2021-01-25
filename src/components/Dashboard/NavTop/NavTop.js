import React from 'react'
import { createMuiTheme } from '@material-ui/core'
import { withStyles, ThemeProvider } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import SearchIcon from '@material-ui/icons/Search'
import HomeIcon from '@material-ui/icons/Home'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { Link } from 'react-router-dom'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'

import { dropDownThemeObj } from '../../../utils/themes'

const dropDownTheme = createMuiTheme(dropDownThemeObj)

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
    hotelSelect: {
      width: '12em',
    },
    hotelSelectLabel: {
      color: theme.palette.secondary.main,
    },
  }
}

class NavTop extends React.Component {
  handlePropChange = (e, propName) => {
    this.props.onPropValueChange(this.props.id, propName, e)
  }

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

            <ThemeProvider theme={dropDownTheme}>
            <FormControl className={classes.hotelSelect}>
              <InputLabel
                id="demo-simple-select-outlined-label"
                className={classes.hotelSelectLabel}
              >
                Hotel
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                value={this.props.hotelId}
                onChange={(e, j) => { this.handlePropChange(j.props.value, 'hotelId') }}
                label="Hotel"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>

                {this.props.hotels.map(hotel => (
                  <MenuItem value={hotel.id} key={hotel.id}>
                    {hotel.type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            </ThemeProvider>

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
