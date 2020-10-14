import React from 'react'
import { withRouter } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import IconButton from '@material-ui/core/IconButton'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import Grid from '@material-ui/core/Grid'
import * as moment from 'moment'

import { apiClient } from '../../../utils/api/client'
import BookingList from './BookingList/BookingList'

function initBookingObj(attrs = {}) {
  const bookingObj = {
    id: attrs.id || uuidv4(),

    checkInDate: attrs.checkInDate || moment(new Date()).format(),
    checkOutDate: attrs.checkOutDate || moment(new Date()).add(1, 'days').format(),
    guestName: attrs.guestName || '',
    guestEmail: attrs.guestEmail || '',
    phoneNumber: attrs.phoneNumber || '',
    roomType: attrs.roomType || '',
  }

  return bookingObj
}

class Bookings extends React.Component {
  constructor(props) {
    super(props)

    this._isDestroyed = false
    this.state = {
      bookings: null,
    }
  }

  componentDidMount() {
    this.getBookings()
  }

  componentWillUnmount() {
    this._isDestroyed = true
  }

  handleAddNewClick = () => {
    this.createBooking({})
  }

  handleEditClick = (id) => {
    this.props.history.push(`/dashboard/bookings/${id}`)
  }

  handleTrashClick = (id) => {
    this.deleteBooking(id)
  }

  handlePropValueChange = (id, propName, newValue) => {
    const bookingToUpdate = this.state.bookings.find((booking) => {
      if (booking.id === id) {
        return true
      }

      return false
    })

    if (bookingToUpdate[propName] === newValue) {
      return
    }
    bookingToUpdate[propName] = newValue

    this.updateBooking(bookingToUpdate)
  }

  getBookings = () => {
    apiClient
      .getBookings()
      .then((bookings) => {
        if (this._isDestroyed) return

        this.setState({ bookings })
      })
      .catch((error) => {
        if (this._isDestroyed) return

        error.response.json().then((errorData) => {
          console.log('errorData', errorData)
        })
      })
  }

  createBooking = (attrs) => {
    const newBooking = initBookingObj(attrs)

    this.setState({
      bookings: this.state.bookings.concat(newBooking),
    })

    apiClient.createBooking(newBooking)
      .then((attrs) => {
        if (this._isDestroyed) return

        this.setState({
          bookings: this.state.bookings.map((booking) => {
            if (booking.id === newBooking.id) {
              return Object.assign({}, booking, {
                id: attrs.id,
              })
            } else {
              return booking
            }
          }),
        })
      })
      .catch((error) => {
        if (this._isDestroyed) return

        error.response.json().then((errorData) => {
          console.log('errorData', errorData)
        })
      })
  }

  updateBooking = (attrs) => {
    this.setState({
      bookings: this.state.bookings.map((booking) => {
        if (booking.id === attrs.id) {
          return Object.assign({}, booking, {
            checkInDate: attrs.checkInDate,
            checkOutDate: attrs.checkOutDate,
            guestName: attrs.guestName,
            guestEmail: attrs.guestEmail,
            phoneNumber: attrs.phoneNumber,
            roomType: attrs.roomType,
          })
        } else {
          return booking
        }
      }),
    })

    apiClient
      .updateBooking(attrs)
      .catch((error) => {
        if (this._isDestroyed) return

        error.response.json().then((errorData) => {
          console.log('errorData', errorData)
        })
      })
  }

  deleteBooking = (id) => {
    this.setState({
      bookings: this.state.bookings.filter(t => t.id !== id),
    })

    apiClient
      .deleteBooking(id)
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
        direction="row"
        justify="center"
        alignItems="center"
      >
        {
          (this.state.bookings === null) ?
            <div>Loading ...</div> :
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <BookingList
                bookings={this.state.bookings}
                onEditClick={this.handleEditClick}
                onTrashClick={this.handleTrashClick}
                onPropValueChange={this.handlePropValueChange}
              />
              <IconButton aria-label="edit" onClick={this.handleAddNewClick}>
                <AddCircleIcon />
              </IconButton>
            </Grid>
        }
      </Grid>
    )
  }
}

export default withRouter(Bookings)
