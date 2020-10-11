import React from 'react'
import { withRouter } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'

import { apiClient } from '../../../utils/api/client'
import Booking from './Booking/Booking'

class BookingEdit extends React.Component {
  constructor(props) {
    super(props)

    this._isDestroyed = false
    this.state = {
      bookingId: props.match.params.bookingId,
      booking: null
    }
  }

  componentDidMount() {
    this.getBooking(this.state.bookingId)
  }

  componentWillUnmount() {
    this._isDestroyed = true
  }

  handleDoneClick = () => {
    this.props.history.push('/dashboard/bookings')
  }

  handleTrashClick = (id) => {
    this.deleteBooking(id)
  }

  handlePropValueChange = (id, propName, newValue) => {
    let booking = Object.assign({}, this.state.booking)

    if (booking[propName] === newValue) {
      return
    }
    booking[propName] = newValue

    this.updateBooking(booking)
  }

  getBooking = (bookingId) => {
    apiClient
      .getBooking(bookingId)
      .then((booking) => {
        if (this._isDestroyed) return

        this.setState({ booking })
      })
      .catch((error) => {
        if (this._isDestroyed) return

        error.response.json().then((errorData) => {
          console.log('errorData', errorData)
        })
      })
  }

  updateBooking = (booking) => {
    this.setState({ booking })

    apiClient
      .updateBooking(booking)
      .catch((error) => {
        if (this._isDestroyed) return

        error.response.json().then((errorData) => {
          console.log('errorData', errorData)
        })
      })
  }

  deleteBooking = (id) => {
    apiClient
      .deleteBooking(id)
      .then(() => {
        if (this._isDestroyed) return

        this.props.history.push('/dashboard/bookings')
      })
      .catch((error) => {
        if (this._isDestroyed) return

        error.response.json().then((errorData) => {
          console.log('errorData', errorData)
        })
      })
  }

  render() {
    return (
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        {
          (this.state.booking === null) ?
            <div>Loading...</div> :
            <Booking
              key={this.state.booking.id}
              id={this.state.booking.id}

              checkInDate={this.state.booking.checkInDate}
              checkOutDate={this.state.booking.checkOutDate}
              guestName={this.state.booking.guestName}
              guestEmail={this.state.booking.guestEmail}
              phoneNumber={this.state.booking.phoneNumber}
              roomType={this.state.booking.roomType}

              onDoneClick={this.handleDoneClick}
              onTrashClick={this.handleTrashClick}
              onPropValueChange={this.handlePropValueChange}
            />
        }
      </Grid>
    )
  }
}

export default withRouter(BookingEdit)
