import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { apiClient } from '../../../utils/apiClient'

import EditableRoomTypeList from './EditableRoomTypeList/EditableRoomTypeList'
import ToggleableRoomTypeForm from './ToggleableRoomTypeForm/ToggleableRoomTypeForm'

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

  handleCreateFormSubmit = (attrs) => {
    this.createRoomType(attrs)
  }

  handleEditFormSubmit = (attrs) => {
    this.updateRoomType(attrs)
  }

  handleTrashClick = (id) => {
    this.deleteRoomType(id)
  }

  handleTypeChange = (id, newType) => {
    const roomTypeToUpdate = this.state.roomTypes.find((roomType) => {
      if (roomType.id === id) {
        return true
      }

      return false
    })

    if (roomTypeToUpdate.type === newType) {
      return
    }

    this.updateRoomType({
      id: roomTypeToUpdate.id,
      price: roomTypeToUpdate.price,
      quantity: roomTypeToUpdate.quantity,
      type: newType,
    })
  }

  handleQuantityChange = (id, newRoomNumber) => {
    const roomTypeToUpdate = this.state.roomTypes.find((roomType) => {
      if (roomType.id === id) {
        return true
      }

      return false
    })

    if (roomTypeToUpdate.quantity === newRoomNumber) {
      return
    }

    this.updateRoomType({
      id: roomTypeToUpdate.id,
      price: roomTypeToUpdate.price,
      quantity: newRoomNumber,
      type: roomTypeToUpdate.type,
    })
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
        <EditableRoomTypeList
          roomTypes={this.state.roomTypes}
          onFormSubmit={this.handleEditFormSubmit}
          onTrashClick={this.handleTrashClick}
          onTypeChange={this.handleTypeChange}
          onQuantityChange={this.handleQuantityChange}
        />
        <ToggleableRoomTypeForm
          onFormSubmit={this.handleCreateFormSubmit}
        />
      </div>
    )
  }
}

export default RoomTypes
