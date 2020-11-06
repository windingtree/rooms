import React from 'react'
import { withRouter } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'

import { errorLogger, objClone } from '../../../utils'
import { apiCache, apiClient } from '../../../utils/api'
import RoomType from './RoomType/RoomType'
import Spinner from '../../base/Spinner/Spinner'

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
    let roomType = objClone(this.state.roomType)

    if (roomType[propName] === newValue) {
      return
    }
    roomType[propName] = newValue

    this.updateRoomType(roomType)
  }

  getRoomType = (roomTypeId) => {
    const _roomType = apiCache.getRoomType(roomTypeId)
    if (_roomType) {
      this.setState({ roomType: _roomType })
    }

    apiClient
      .getRoomType(roomTypeId)
      .then((roomType) => {
        if (this._isDestroyed) return

        this.setState({ roomType })
      })
      .catch((error) => {
        if (this._isDestroyed) return

        errorLogger(error)
      })
  }

  updateRoomType = (roomType) => {
    this.setState({ roomType })

    apiClient
      .updateRoomType(roomType)
      .catch((error) => {
        if (this._isDestroyed) return

        errorLogger(error)
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
          (!this.state.roomType) ?
            <Spinner info="loading" /> :
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
