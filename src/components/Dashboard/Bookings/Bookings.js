import React from 'react'
import { withRouter } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import IconButton from '@material-ui/core/IconButton'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import Grid from '@material-ui/core/Grid'
import * as moment from 'moment'

import { apiCache, apiClient } from '../../../utils/api'
import BookingList from './BookingList/BookingList'
import Spinner from '../../base/Spinner/Spinner'

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
      bookings: [],
      apiLoading: true,
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
    this.setState({
      bookings: apiCache.getBookings(),
      apiLoading: true,
    })

    apiClient
      .getBookings()
      .then((bookings) => {
        if (this._isDestroyed) return

        apiCache.setBookings(bookings)

        this.setState({
          bookings,
          apiLoading: false,
        })
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

    apiCache.addBooking(newBooking)

    this.setState({
      bookings: this.state.bookings.concat(newBooking),
    })

    apiClient.createBooking(newBooking)
      .then((attrs) => {
        if (this._isDestroyed) return

        this.setState({
          bookings: this.state.bookings.map((booking) => {
            if (booking.id === newBooking.id) {
              const _booking = Object.assign({}, booking, {
                id: attrs.id,
              })

              apiCache.updateBooking(booking.id, _booking)

              return _booking
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
          const _booking = Object.assign({}, booking, {
            checkInDate: attrs.checkInDate,
            checkOutDate: attrs.checkOutDate,
            guestName: attrs.guestName,
            guestEmail: attrs.guestEmail,
            phoneNumber: attrs.phoneNumber,
            roomType: attrs.roomType,
          })

          apiCache.updateBooking(booking.id, _booking)

          return _booking
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
    apiCache.deleteBooking(id)

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
        direction="column"
        justify="center"
        alignItems="center"
        style={{ minHeight: '100%' }}
      >
        {
          ((!this.state.bookings || !this.state.bookings.length) && (this.state.apiLoading)) ?
            <Spinner info="loading" /> :
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
