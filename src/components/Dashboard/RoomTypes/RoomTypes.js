import React from 'react'
import { v4 as uuidv4 } from 'uuid'
import IconButton from '@material-ui/core/IconButton'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import Grid from '@material-ui/core/Grid'

import { apiClient } from '../../../utils/apiClient'
import RoomTypeList from './RoomTypeList/RoomTypeList'

function initRoomTypeObj(attrs = {}) {
  const roomTypeObj = {
    quantity: attrs.quantity || 0,
    type: attrs.type || '',
    id: attrs.id || uuidv4(),
    price: attrs.price || 0,
  }

  return roomTypeObj
}

class RoomTypes extends React.Component {
  constructor(props) {
    super(props)

    this._isDestroyed = false
    this.state = {
      roomTypes: [],
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

  handleEditClick = () => {
    console.log('Edit clicked.')
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
    apiClient
      .getRoomTypes()
      .then((roomTypes) => {
        if (this._isDestroyed) return

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

    this.setState({
      roomTypes: this.state.roomTypes.concat(newRoomType),
    })

    apiClient.createRoomType(newRoomType)
      .then((attrs) => {
        if (this._isDestroyed) return

        this.setState({
          roomTypes: this.state.roomTypes.map((roomType) => {
            if (roomType.id === newRoomType.id) {
              return Object.assign({}, roomType, {
                id: attrs.id,
              })
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
          return Object.assign({}, roomType, {
            quantity: attrs.quantity,
            type: attrs.type,
            price: attrs.price,
          })
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
      <div>
        <RoomTypeList
          roomTypes={this.state.roomTypes}
          onEditClick={this.handleEditClick}
          onTrashClick={this.handleTrashClick}
          onPropValueChange={this.handlePropValueChange}
        />
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <IconButton aria-label="edit" onClick={this.handleAddNewClick}>
            <AddCircleIcon />
          </IconButton>
        </Grid>
      </div>
    )
  }
}

export default RoomTypes
