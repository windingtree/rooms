import React from 'react'
import { withRouter } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import IconButton from '@material-ui/core/IconButton'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import Grid from '@material-ui/core/Grid'

import { apiCache, apiClient } from '../../../utils/api'
import RoomTypeList from './RoomTypeList/RoomTypeList'

function initRoomTypeObj(attrs = {}) {
  const roomTypeObj = {
    id: attrs.id || uuidv4(),

    type: attrs.type || '',
    quantity: attrs.quantity || 0,
    price: attrs.price || 0,
    amenities: attrs.amenities || '',
  }

  return roomTypeObj
}

class RoomTypes extends React.Component {
  constructor(props) {
    super(props)

    this._isDestroyed = false
    this.state = {
      roomTypes: null,
    }
  }

  componentDidMount() {
    this.getRoomTypes()
  }

  componentWillUnmount() {
    this._isDestroyed = true
  }

  handleAddNewClick = () => {
    this.createRoomType({})
  }

  handleEditClick = (id) => {
    this.props.history.push(`/dashboard/room-types/${id}`)
  }

  handleTrashClick = (id) => {
    this.deleteRoomType(id)
  }

  handlePropValueChange = (id, propName, newValue) => {
    const roomTypeToUpdate = this.state.roomTypes.find((roomType) => {
      if (roomType.id === id) {
        return true
      }

      return false
    })

    if (roomTypeToUpdate[propName] === newValue) {
      return
    }
    roomTypeToUpdate[propName] = newValue

    this.updateRoomType(roomTypeToUpdate)
  }

  getRoomTypes = () => {
    this.setState({ roomTypes: apiCache.getRoomTypes() })

    apiClient
      .getRoomTypes()
      .then((roomTypes) => {
        if (this._isDestroyed) return

        apiCache.setRoomTypes(roomTypes)

        this.setState({ roomTypes })
      })
      .catch((error) => {
        if (this._isDestroyed) return

        error.response.json().then((errorData) => {
          console.log('errorData', errorData)
        })
      })
  }

  createRoomType = (attrs) => {
    const newRoomType = initRoomTypeObj(attrs)

    apiCache.addRoomType(newRoomType)

    this.setState({
      roomTypes: this.state.roomTypes.concat(newRoomType),
    })

    apiClient.createRoomType(newRoomType)
      .then((attrs) => {
        if (this._isDestroyed) return

        this.setState({
          roomTypes: this.state.roomTypes.map((roomType) => {
            if (roomType.id === newRoomType.id) {
              const _roomType = Object.assign({}, roomType, {
                id: attrs.id,
              })

              apiCache.updateRoomType(roomType.id, _roomType)

              return _roomType
            } else {
              return roomType
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

  updateRoomType = (attrs) => {
    this.setState({
      roomTypes: this.state.roomTypes.map((roomType) => {
        if (roomType.id === attrs.id) {
          const _roomType = Object.assign({}, roomType, {
            quantity: attrs.quantity,
            type: attrs.type,
            price: attrs.price,
            amenities: attrs.amenities,
          })

          apiCache.updateRoomType(roomType.id, _roomType)

          return _roomType
        } else {
          return roomType
        }
      }),
    })

    apiClient
      .updateRoomType(attrs)
      .catch((error) => {
        if (this._isDestroyed) return

        error.response.json().then((errorData) => {
          console.log('errorData', errorData)
        })
      })
  }

  deleteRoomType = (id) => {
    apiCache.deleteRoomType(id)

    this.setState({
      roomTypes: this.state.roomTypes.filter(t => t.id !== id),
    })

    apiClient
      .deleteRoomType(id)
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
          (this.state.roomTypes === null) ?
            <div>Loading ...</div> :
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <RoomTypeList
                roomTypes={this.state.roomTypes}
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

export default withRouter(RoomTypes)
