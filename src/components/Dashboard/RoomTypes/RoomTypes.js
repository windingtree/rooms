import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { apiClient } from '../../../utils/apiClient'

import EditableRoomTypeList from './EditableRoomTypeList/EditableRoomTypeList'
import ToggleableRoomTypeForm from './ToggleableRoomTypeForm/ToggleableRoomTypeForm'

function initRoomTypeObj(attrs = {}) {
  const roomTypeObj = {
    roomNumber: attrs.roomNumber || 'Room Number',
    roomType: attrs.roomType || 'Room Type',
    roomId: attrs.roomId || uuidv4(),
    isEmpty: attrs.isEmpty || 1,
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
    this.loadRoomsFromServer()
  }

  componentWillUnmount() {
    this._isDestroyed = true
  }

  loadRoomsFromServer = () => {
    apiClient.getRoomTypes()
      .then((serverRooms) => {
        if (this._isDestroyed) return

        this.setState({ roomTypes: serverRooms })
      })
  }

  handleCreateFormSubmit = (room) => {
    this.createRoom(room)
  }

  handleEditFormSubmit = (attrs) => {
    this.updateRoom(attrs)
  }

  handleTrashClick = (roomId) => {
    this.deleteRoom(roomId)
  }

  handleRoomTypeChange = (roomId, newRoomType) => {
    const roomToUpdate = this.state.roomTypes.find((room) => {
      if (room.roomId === roomId) {
        return true
      }

      return false
    })

    if (roomToUpdate.roomType === newRoomType) {
      return
    }

    this.updateRoom({
      roomId: roomToUpdate.roomId,
      isEmpty: roomToUpdate.isEmpty,
      roomNumber: roomToUpdate.roomNumber,
      roomType: newRoomType,
    })
  }

  handleRoomNumberChange = (roomId, newRoomNumber) => {
    const roomToUpdate = this.state.roomTypes.find((room) => {
      if (room.roomId === roomId) {
        return true
      }

      return false
    })

    if (roomToUpdate.roomNumber === newRoomNumber) {
      return
    }

    this.updateRoom({
      roomId: roomToUpdate.roomId,
      isEmpty: roomToUpdate.isEmpty,
      roomNumber: newRoomNumber,
      roomType: roomToUpdate.roomType,
    })
  }

  createRoom = (room) => {
    const t = initRoomTypeObj(room)

    this.setState({
      roomTypes: this.state.roomTypes.concat(t),
    })

    apiClient.createRoomType(t).then((attrs) => {
      if (this._isDestroyed) return

      this.setState({
        roomTypes: this.state.roomTypes.map((room) => {
          if (room.roomId === t.roomId) {
            return Object.assign({}, room, {
              roomId: attrs.roomId
            })
          } else {
            return room
          }
        }),
      })
    })
  }

  updateRoom = (attrs) => {
    this.setState({
      roomTypes: this.state.roomTypes.map((room) => {
        if (room.roomId === attrs.roomId) {
          return Object.assign({}, room, {
            roomNumber: attrs.roomNumber,
            roomType: attrs.roomType,
            isEmpty: attrs.isEmpty
          })
        } else {
          return room
        }
      }),
    })

    apiClient.updateRoomType(attrs)
  }

  deleteRoom = (roomId) => {
    this.setState({
      roomTypes: this.state.roomTypes.filter(t => t.roomId !== roomId),
    })

    apiClient.deleteRoomType(
      { roomId }
    )
  }

  render() {
    return (
      <div className='ui three column centered grid'>
        <div className='column'>
          <EditableRoomTypeList
            roomTypes={this.state.roomTypes}
            onFormSubmit={this.handleEditFormSubmit}
            onTrashClick={this.handleTrashClick}
            onRoomTypeChange={this.handleRoomTypeChange}
            onRoomNumberChange={this.handleRoomNumberChange}
          />
          <ToggleableRoomTypeForm
            onFormSubmit={this.handleCreateFormSubmit}
          />
        </div>
      </div>
    )
  }
}

export default RoomTypes
