import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import UseMapEventsHook from './UseMapEventsHook'
import TextEditInput from '../../base/TextEditInput/TextEditInput'
import { apiClient } from '../../../utils/api'
import { ApiCache } from '../../../utils/api_cache'
import Spinner from '../../base/Spinner/Spinner'
import { errorLogger } from '../../../utils/functions'

const useStyles = () => {
  return {
    mapContainer: {
      width: '100%',
      height: '300px',
      marginTop: '1.5em',
    },
    mapHint: {
      textAlign: 'center',
    },
  }
}

class Profile extends React.Component {
  constructor(props) {
    super(props)

    this.apiCache = ApiCache.getInstance()

    this._isDestroyed = false

    this.profile = this.apiCache.getProfile()

    this.state = {
      hotelId: '',
      name: '',
      address: '',
      location: [0, 0],
      locationStr: '0, 0',

      apiLoading: true,
    }
  }

  componentDidMount() {
    this.getHotel()
  }

  componentWillUnmount() {
    this._isDestroyed = true
  }

  setStateFromHotel = (hotel) => {
    const lat = ((hotel.location) && (typeof hotel.location.lat === 'number')) ?
      hotel.location.lat : 48.872788
    const lng = ((hotel.location) && (typeof hotel.location.lng === 'number')) ?
      hotel.location.lng : 2.321557

    const locationCoords = [lat, lng]

    this.setState({
      hotelId: (hotel.id) ? hotel.id : '',
      name: (hotel.name) ? hotel.name : '',
      address: (hotel.address) ? hotel.address : '',
      location: locationCoords,
      locationStr: this.getLocationStr(locationCoords),
    })
  }

  getHotel = () => {
    const hotel = this.apiCache.getHotel()

    this.setStateFromHotel(hotel)
    this.setState({
      apiLoading: true,
    })

    apiClient
      .getHotel(this.profile.hotelId)
      .then((hotel) => {
        if (this._isDestroyed) return

        this.setStateFromHotel(hotel)
        this.setState({
          apiLoading: false,
        })
      })
      .catch((error) => {
        if (this._isDestroyed) return

        errorLogger(error)
      })
  }

  updateHotel = (property, value) => {
    const data = {}
    data[property] = value

    apiClient
      .updateHotel(this.profile.hotelId, data)
      .catch((error) => {
        if (this._isDestroyed) return

        errorLogger(error)
      })
  }

  getLocationStr = (locationCoords) => {
    return `${locationCoords[0]}, ${locationCoords[1]}`
  }

  setLocation = (newLocation) => {
    const locationCoords = [newLocation.lat, newLocation.lng]

    this.setState({
      location: locationCoords,
      locationStr: this.getLocationStr(locationCoords),
    })

    this.updateHotel('location', newLocation)
  }

  onHotelNameChange = (newValue) => {
    this.setState({
      name: newValue,
    })

    this.updateHotel('name', newValue)
  }

  onHotelAddressChange = (newValue) => {
    this.setState({
      address: newValue,
    })

    this.updateHotel('address', newValue)
  }

  render() {
    const { classes } = this.props

    return (
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="stretch"
        style={{ minHeight: '100%' }}
      >
        {
          ((!this.state.hotelId) && (this.state.apiLoading === true)) ?
            <Spinner info="loading" />:
            <div>
              <div><h1>Profile</h1></div>
              <div>
                <TextEditInput
                  label="Hotel ID"
                  value={this.state.hotelId}
                  inputWidth={400}
                  editable={false}
                />
              </div>
              <div>
                <TextEditInput
                  label="Hotel Name"
                  value={this.state.name}
                  onValueChange={this.onHotelNameChange}
                  inputWidth={400}
                />
              </div>
              <div>
                <TextEditInput
                  label="Hotel Address"
                  value={this.state.address}
                  onValueChange={this.onHotelAddressChange}
                  inputWidth={400}
                />
              </div>
              <div>
                <TextEditInput
                  label="Hotel Location"
                  value={this.state.locationStr}
                  inputWidth={400}
                  editable={false}
                />
              </div>
              <div className={classes.mapHint}>
                Please select on the map where your hotel is located.
              </div>
              <MapContainer
                center={this.state.location}
                zoom={13}
                scrollWheelZoom={true}
                className={classes.mapContainer}
              >
                <UseMapEventsHook setPosition={this.setLocation} />
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={this.state.location}>
                  <Popup>{(this.state.name) ? this.state.name : 'Hotel'}</Popup>
                </Marker>
              </MapContainer>
            </div>
        }
      </Grid>
    )
  }
}

export default withStyles(useStyles)(Profile)
