import React from 'react'
import { withRouter } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'

import { apiClient } from '../../../utils/apiClient'
import RoomType from './RoomType/RoomType'

class RoomTypeEdit extends React.Component {
  constructor(props) {
    super(props)

    this._isDestroyed = false
    this.state = {
      roomTypeId: props.match.params.roomTypeId,
      roomType: null
    }
  }

  componentDidMount() {
    this.getRoomType(this.state.roomTypeId)
  }

  componentWillUnmount() {
    this._isDestroyed = true
  }

  handleDoneClick = () => {
    this.props.history.push('/dashboard/room-types')
  }

  handleTrashClick = (id) => {
    this.deleteRoomType(id)
  }

  handlePropValueChange = (id, propName, newValue) => {
    let roomType = Object.assign({}, this.state.roomType)

    if (roomType[propName] === newValue) {
      return
    }
    roomType[propName] = newValue

    this.updateRoomType(roomType)
  }

  getRoomType = (roomTypeId) => {
    apiClient
      .getRoomType(roomTypeId)
      .then((roomType) => {
        if (this._isDestroyed) return

        this.setState({ roomType })
      })
      .catch((error) => {
        if (this._isDestroyed) return

        error.response.json().then((errorData) => {
          console.log('errorData', errorData)
        })
      })
  }

  updateRoomType = (roomType) => {
    this.setState({ roomType })

    apiClient
      .updateRoomType(roomType)
      .catch((error) => {
        if (this._isDestroyed) return

        error.response.json().then((errorData) => {
          console.log('errorData', errorData)
        })
      })
  }

  deleteRoomType = (id) => {
    apiClient
      .deleteRoomType(id)
      .then(() => {
        if (this._isDestroyed) return

        this.props.history.push('/dashboard/room-types')
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
          (this.state.roomType === null) ?
            <div>Loading...</div> :
            <RoomType
              key={this.state.roomType.id}
              id={this.state.roomType.id}
              quantity={this.state.roomType.quantity}
              type={this.state.roomType.type}
              price={this.state.roomType.price}
              amenities={this.state.roomType.amenities}
              onDoneClick={this.handleDoneClick}
              onTrashClick={this.handleTrashClick}
              onPropValueChange={this.handlePropValueChange}
            />
        }
      </Grid>
    )
  }
}

export default withRouter(RoomTypeEdit)
