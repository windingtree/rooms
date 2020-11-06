import React from 'react'
import { withRouter } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'

import { errorLogger } from '../../../utils'
import { apiCache, apiClient } from '../../../utils/api'
import Booking from './Booking/Booking'
import Spinner from '../../base/Spinner/Spinner'

class BookingEdit extends React.Component {
  constructor(props) {
    super(props)

    this._isDestroyed = false
    this.state = {
      bookingId: props.match.params.bookingId,
      booking: null,
      roomTypes: [],
    }
  }

  componentDidMount() {
    this.getRoomTypes()
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

  getRoomTypes = () => {
    this.setState({
      roomTypes: apiCache.getRoomTypes(),
    })

    apiClient
      .getRoomTypes()
      .then((roomTypes) => {
        if (this._isDestroyed) return

        apiCache.setRoomTypes(roomTypes)

        this.setState({
          roomTypes,
        })
      })
      .catch((error) => {
        if (this._isDestroyed) return

        errorLogger(error)
      })
  }

  getBooking = (bookingId) => {
    const _booking = apiCache.getBooking(bookingId)
    if (_booking) {
      this.setState({ booking: _booking })
    }

    apiClient
      .getBooking(bookingId)
      .then((booking) => {
        if (this._isDestroyed) return

        this.setState({ booking })
      })
      .catch((error) => {
        if (this._isDestroyed) return

        errorLogger(error)
      })
  }

  updateBooking = (booking) => {
    apiCache.updateBooking(booking.id, booking)

    this.setState({ booking })

    apiClient
      .updateBooking(booking)
      .catch((error) => {
        if (this._isDestroyed) return

        errorLogger(error)
      })
  }

  deleteBooking = (id) => {
    apiCache.deleteBooking(id)

    apiClient
      .deleteBooking(id)
      .then(() => {
        if (this._isDestroyed) return

        this.props.history.push('/dashboard/bookings')
      })
      .catch((error) => {
        if (this._isDestroyed) return

        errorLogger(error)
      })
  }

  render() {
    return (
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        style={{ minHeight: '100%' }}
      >
        {
          (!this.state.booking) ?
            <Spinner info="loading" /> :
            <Booking
              key={this.state.booking.id}
              id={this.state.booking.id}

              checkInDate={this.state.booking.checkInDate}
              checkOutDate={this.state.booking.checkOutDate}
              guestName={this.state.booking.guestName}
              guestEmail={this.state.booking.guestEmail}
              phoneNumber={this.state.booking.phoneNumber}
              roomType={this.state.booking.roomType}

              roomTypes={this.state.roomTypes}

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
