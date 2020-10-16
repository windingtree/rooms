import React from 'react'

import { createMuiTheme } from '@material-ui/core'
import { withStyles, ThemeProvider } from '@material-ui/core/styles'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'

import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import {
  KeyboardDatePicker
} from '@material-ui/pickers'
import * as moment from 'moment'

import TextEditInput from '../../../base/TextEditInput/TextEditInput'
import { datePickerThemeObj } from '../../../../utils/themes'

const datePickerTheme = createMuiTheme(datePickerThemeObj);

const useStyles = () => {
  return {
    grow: {
      flexGrow: 1,
    },
    booking_card: {
      width: '26em',
      marginTop: '1em',
      marginBottom: '1em',
    },
  }
}

class Booking extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      checkInDate: this.props.checkInDate,
      checkOutDate: this.props.checkOutDate,
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.checkInDate !== prevProps.checkInDate) {
      this.setState({ checkInDate: this.props.checkInDate })
    }

    if (this.props.checkOutDate !== prevProps.checkOutDate) {
      this.setState({ checkOutDate: this.props.checkOutDate })
    }
  }

  handleTrashClick = () => {
    this.props.onTrashClick(this.props.id)
  }

  handleEditClick = () => {
    this.props.onEditClick(this.props.id)
  }

  handlePropChange = (e, propName) => {
    if ((propName === 'checkInDate') || (propName === 'checkOutDate')) {
      if (!e.isValid()) {
        return
      }

      e = moment(e).format()

      const updatedState = {}
      updatedState[propName] = e
      this.setState(updatedState)
    }

    this.props.onPropValueChange(this.props.id, propName, e)
  }

  render() {
    const { classes } = this.props

    return (
      <Card className={classes.booking_card}>
        <CardContent>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="stretch"
          >
            <Grid item>
              <ThemeProvider theme={datePickerTheme}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="DD/MM/yyyy"
                  margin="normal"
                  label="Check In"
                  value={this.state.checkInDate}
                  onChange={(e) => { this.handlePropChange(e, 'checkInDate') }}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
              </ThemeProvider>
            </Grid>
            <Grid item>
              <ThemeProvider theme={datePickerTheme}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="DD/MM/yyyy"
                  margin="normal"
                  label="Check Out"
                  value={this.state.checkOutDate}
                  onChange={(e) => { this.handlePropChange(e, 'checkOutDate') }}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
              </ThemeProvider>
            </Grid>
            <Grid item>
              <TextEditInput
                value={this.props.guestName}
                label="Name"
                onValueChange={(e) => { this.handlePropChange(e, 'guestName') }}
                inputWidth="150"
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <IconButton aria-label="edit" onClick={this.handleEditClick}>
            <EditIcon />
          </IconButton>

          <div className={classes.grow}></div>

          <IconButton aria-label="delete" onClick={this.handleTrashClick}>
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Card>
    )
  }
}

export default withStyles(useStyles)(Booking)
