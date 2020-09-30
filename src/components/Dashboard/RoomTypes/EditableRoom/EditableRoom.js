import React from 'react'

import RoomForm from '../RoomForm/RoomForm'
import Room from '../Room/Room'

class EditableRoom extends React.Component {
  state = {
    editFormOpen: false,
  }

  handleEditClick = () => {
    this.openForm()
  }

  handleFormClose = () => {
    this.closeForm()
  }

  handleSubmit = (room) => {
    this.props.onFormSubmit(room)
    this.closeForm()
  }

  closeForm = () => {
    this.setState({ editFormOpen: false })
  }

  openForm = () => {
    this.setState({ editFormOpen: true })
  }

  render() {
    if (this.state.editFormOpen) {
      return (
        <RoomForm
          id={this.props.id}
          roomNumber={this.props.roomNumber}
          roomType={this.props.roomType}
          isEmpty={this.props.isEmpty}
          onFormSubmit={this.handleSubmit}
          onFormClose={this.handleFormClose}
        />
      )
    } else {
      return (
        <Room
          id={this.props.id}
          roomNumber={this.props.roomNumber}
          roomType={this.props.roomType}
          elapsed={this.props.elapsed}
          isEmpty={this.props.isEmpty}
          onEditClick={this.handleEditClick}
          onTrashClick={this.props.onTrashClick}
          onStartClick={this.props.onStartClick}
          onStopClick={this.props.onStopClick}
          onRoomTypeChange={this.props.onRoomTypeChange}
          onRoomNumberChange={this.props.onRoomNumberChange}
        />
      )
    }
  }
}

export default EditableRoom
