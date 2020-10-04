import React from 'react'

import RoomTypeForm from '../RoomTypeForm/RoomTypeForm'
import RoomType from '../RoomType/RoomType'

class EditableRoomType extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      editFormOpen: false,
    }
  }

  handleEditClick = () => {
    this.openForm()
  }

  handleFormClose = () => {
    this.closeForm()
  }

  handleSubmit = (roomType) => {
    this.props.onFormSubmit(roomType)
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
          id={this.props.id}
          quantity={this.props.quantity}
          type={this.props.type}
          price={this.props.price}
          onFormSubmit={this.handleSubmit}
          onFormClose={this.handleFormClose}
        />
      )
    } else {
      return (
        <RoomType
          id={this.props.id}
          quantity={this.props.quantity}
          type={this.props.type}
          price={this.props.price}
          onEditClick={this.handleEditClick}
          onTrashClick={this.props.onTrashClick}
          onTypeChange={this.props.onTypeChange}
          onQuantityChange={this.props.onQuantityChange}
        />
      )
    }
  }
}

export default EditableRoomType
