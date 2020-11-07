import React from 'react'
import { withRouter } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import IconButton from '@material-ui/core/IconButton'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import Grid from '@material-ui/core/Grid'
import * as moment from 'moment'

import { errorLogger, objClone } from '../../../utils/functions'
import { apiClient } from '../../../utils/api'
import { ApiCache } from '../../../utils/api_cache'
import BookingList from './BookingList/BookingList'
import Spinner from '../../base/Spinner/Spinner'

function initBookingObj() {
  const now = new Date()
  const bookingObj = {
    id: uuidv4(),

    checkInDate: moment(now).format(),
    checkOutDate: moment(now).add(1, 'days').format(),
    guestName: '',
    guestEmail: '',
    phoneNumber: '',
    roomType: '',
  }

  return bookingObj
}

class Bookings extends React.Component {
  constructor(props) {
    super(props)

    this.apiCache = ApiCache.getInstance()

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
    this.createBooking()
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
      bookings: this.apiCache.getBookings(),
      apiLoading: true,
    })

    apiClient
      .getBookings()
      .then((bookings) => {
        if (this._isDestroyed) return

        this.setState({
          bookings,
          apiLoading: false,
        })
      })
      .catch((error) => {
        if (this._isDestroyed) return

        errorLogger(error)
      })
  }

  createBooking = () => {
    const newBooking = initBookingObj()

    this.setState({
      bookings: this.state.bookings.concat(newBooking),
    })

    apiClient.createBooking(newBooking)
      .then((attrs) => {
        if (this._isDestroyed) return

        this.setState({
          bookings: this.state.bookings.map((booking) => {
            if (booking.id === newBooking.id) {
              const _booking = Object.assign(
                {},
                objClone(booking),
                {
                  id: attrs.id
                }
              )

              return _booking
            } else {
              return booking
            }
          }),
        })
      })
      .catch((error) => {
        if (this._isDestroyed) return

        errorLogger(error)
      })
  }

  updateBooking = (attrs) => {
    this.setState({
      bookings: this.state.bookings.map((booking) => {
        if (booking.id === attrs.id) {
          const _booking = Object.assign(
            {},
            objClone(booking),
            {
              checkInDate: attrs.checkInDate,
              checkOutDate: attrs.checkOutDate,
              guestName: attrs.guestName,
              guestEmail: attrs.guestEmail,
              phoneNumber: attrs.phoneNumber,
              roomType: attrs.roomType,
            }
          )

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

        errorLogger(error)
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
