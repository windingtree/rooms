import React from 'react'

import RoomTypeForm from '../RoomTypeForm/RoomTypeForm'
import RoomType from '../RoomType/RoomType'

class EditableRoomType extends React.Component {
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
        <RoomTypeForm
          roomId={this.props.roomId}
          roomNumber={this.props.roomNumber}
          roomType={this.props.roomType}
          isEmpty={this.props.isEmpty}
          onFormSubmit={this.handleSubmit}
          onFormClose={this.handleFormClose}
        />
      )
    } else {
      return (
        <RoomType
          roomId={this.props.roomId}
          roomNumber={this.props.roomNumber}
          roomType={this.props.roomType}
          isEmpty={this.props.isEmpty}
          onEditClick={this.handleEditClick}
          onTrashClick={this.props.onTrashClick}
          onRoomTypeChange={this.props.onRoomTypeChange}
          onRoomNumberChange={this.props.onRoomNumberChange}
        />
      )
    }
  }
}

export default EditableRoomType
