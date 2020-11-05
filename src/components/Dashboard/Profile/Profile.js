import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { withStyles } from '@material-ui/core/styles'

import UseMapEventsHook from './UseMapEventsHook'
import TextEditInput from '../../base/TextEditInput/TextEditInput'

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

    const positionCoords = [48.872788, 2.321557]

    this.state = {
      ownerEmail: 'valera.rozuvan@gmail.com',
      hotelName: 'Hyatt Paris Madeleine',
      hotelAddress: '24 Boulevard Malesherbes, 75008 Paris, France',
      position: positionCoords,
      positionStr: this.getPositionStr(positionCoords),
    }
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
  }

  onHotelNameChange = (newValue) => {
    this.setState({
      hotelName: newValue,
    })
  }

  onHotelAddressChange = (newValue) => {
    this.setState({
      hotelAddress: newValue,
    })
  }

  render() {
    const { classes } = this.props

    return (
      <div>
        <div><h1>Profile</h1></div>
        <div>
          <TextEditInput
            label="Owner Email"
            value={this.state.ownerEmail}
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
            <Popup>{this.state.hotelName}</Popup>
          </Marker>
        </MapContainer>
      </div>
    )
  }
}

export default withStyles(useStyles)(Profile)
