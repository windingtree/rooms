import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import UseMapEventsHook from './UseMapEventsHook'
import TextEditInput from '../../base/TextEditInput/TextEditInput'
import { apiClient } from '../../../utils/api'
import { apiCache } from '../../../utils/api_cache'
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

    this._isDestroyed = false

    this.state = {
      email: '',
      hotelName: '',
      hotelAddress: '',
      position: [0, 0],
      positionStr: '0, 0',

      apiLoading: true,
    }
  }

  componentDidMount() {
    this.getProfile()
  }

  componentWillUnmount() {
    this._isDestroyed = true
  }

  setStateFromProfile = (profile) => {
    const lat = ((profile.hotelLocation) && (typeof profile.hotelLocation.lat === 'number')) ?
      profile.hotelLocation.lat : 48.872788
    const lng = ((profile.hotelLocation) && (typeof profile.hotelLocation.lng === 'number')) ?
      profile.hotelLocation.lng : 2.321557

    const positionCoords = [lat, lng]

    this.setState({
      email: (profile.email) ? profile.email : '',
      hotelName: (profile.hotelName) ? profile.hotelName : '',
      hotelAddress: (profile.hotelAddress) ? profile.hotelAddress : '',
      position: positionCoords,
      positionStr: this.getPositionStr(positionCoords),
    })
  }

  getProfile = () => {
    const profile = apiCache.getProfile()

    this.setStateFromProfile(profile)
    this.setState({
      apiLoading: true,
    })

    apiClient
      .getProfile()
      .then((profile) => {
        if (this._isDestroyed) return

        this.setStateFromProfile(profile)
        this.setState({
          apiLoading: false,
        })
      })
      .catch((error) => {
        if (this._isDestroyed) return

        errorLogger(error)
      })
  }

  updateProfile = (property, value) => {
    apiClient
      .updateProfile({ property, value })
      .catch((error) => {
        if (this._isDestroyed) return

        errorLogger(error)
      })
  }

  getPositionStr = (positionCoords) => {
    return `${positionCoords[0]}, ${positionCoords[1]}`
  }

  setPosition = (newPosition) => {
    const positionCoords = [newPosition.lat, newPosition.lng]

    this.setState({
      position: positionCoords,
      positionStr: this.getPositionStr(positionCoords),
    })

    this.updateProfile('hotelLocation', newPosition)
  }

  onHotelNameChange = (newValue) => {
    this.setState({
      hotelName: newValue,
    })

    this.updateProfile('hotelName', newValue)
  }

  onHotelAddressChange = (newValue) => {
    this.setState({
      hotelAddress: newValue,
    })

    this.updateProfile('hotelAddress', newValue)
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
          ((!this.state.email) && (this.state.apiLoading === true)) ?
            <Spinner info="loading" />:
            <div>
              <div><h1>Profile</h1></div>
              <div>
                <TextEditInput
                  label="Owner Email"
                  value={this.state.email}
                  inputWidth={400}
                  editable={false}
                />
              </div>
              <div>
                <TextEditInput
                  label="Hotel Name"
                  value={this.state.hotelName}
                  onValueChange={this.onHotelNameChange}
                  inputWidth={400}
                />
              </div>
              <div>
                <TextEditInput
                  label="Hotel Address"
                  value={this.state.hotelAddress}
                  onValueChange={this.onHotelAddressChange}
                  inputWidth={400}
                />
              </div>
              <div>
                <TextEditInput
                  label="Hotel Location"
                  value={this.state.positionStr}
                  inputWidth={400}
                  editable={false}
                />
              </div>
              <div className={classes.mapHint}>
                Please select on the map where your hotel is located.
              </div>
              <MapContainer
                center={this.state.position}
                zoom={13}
                scrollWheelZoom={true}
                className={classes.mapContainer}
              >
                <UseMapEventsHook setPosition={this.setPosition} />
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={this.state.position}>
                  <Popup>{(this.state.hotelName) ? this.state.hotelName : 'Hotel'}</Popup>
                </Marker>
              </MapContainer>
            </div>
        }
      </Grid>
    )
  }
}

export default withStyles(useStyles)(Profile)
