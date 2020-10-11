import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import DoneIcon from '@material-ui/icons/Done';

import TextEditInput from '../../../base/TextEditInput/TextEditInput'

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
  handleTrashClick = () => {
    this.props.onTrashClick(this.props.id)
  }

  handleEditClick = () => {
    this.props.onDoneClick(this.props.id)
  }

  handlePropChange = (e, propName) => {
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
              <TextEditInput
                value={this.props.checkInDate}
                label="Check In"
                onValueChange={(e) => { this.handlePropChange(e, 'checkInDate') }}
                inputWidth="150"
              />
              <TextEditInput
                value={this.props.checkOutDate}
                label="Check Out"
                onValueChange={(e) => { this.handlePropChange(e, 'checkOutDate') }}
                inputWidth="150"
              />
            </Grid>
            <Grid item>
              <TextEditInput
                value={this.props.guestName}
                label="Name"
                onValueChange={(e) => { this.handlePropChange(e, 'guestName') }}
                inputWidth="150"
              />
              <TextEditInput
                value={this.props.guestEmail}
                label="Email"
                onValueChange={(e) => { this.handlePropChange(e, 'guestEmail') }}
                inputWidth="150"
              />
            </Grid>
            <Grid item>
              <TextEditInput
                value={this.props.phoneNumber}
                label="Phone"
                onValueChange={(e) => { this.handlePropChange(e, 'phoneNumber') }}
                inputWidth="150"
              />
              <TextEditInput
                value={this.props.roomType}
                label="Room Type"
                onValueChange={(e) => { this.handlePropChange(e, 'roomType') }}
                inputWidth="150"
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <IconButton aria-label="done" onClick={this.handleEditClick}>
            <DoneIcon />
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
