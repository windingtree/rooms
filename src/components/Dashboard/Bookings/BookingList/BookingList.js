import React from 'react'
import Grid from '@material-ui/core/Grid'

import Booking from '../Booking/Booking'

class BookingList extends React.Component {
  render() {
    const bookings = this.props.bookings.map((booking) => (
      <Booking
        key={booking.id}
        id={booking.id}

        checkInDate={booking.checkInDate}
        checkOutDate={booking.checkOutDate}
        guestName={booking.guestName}
        creating={booking.creating}

        onEditClick={this.props.onEditClick}
        onTrashClick={this.props.onTrashClick}
        onPropValueChange={this.props.onPropValueChange}
      />
    ))

    return (
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        <div>
          {bookings}
        </div>
      </Grid>
    )
  }
}

export default BookingList
