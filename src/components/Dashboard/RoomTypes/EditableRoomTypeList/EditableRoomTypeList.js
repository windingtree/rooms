import React from 'react'
import Grid from '@material-ui/core/Grid'

import EditableRoomType from '../EditableRoomType/EditableRoomType'

class EditableRoomTypeList extends React.Component {
  render() {
    const roomTypes = this.props.roomTypes.map((roomType) => (
      <EditableRoomType
        key={roomType.id}
        id={roomType.id}
        quantity={roomType.quantity}
        type={roomType.type}
        price={roomType.price}
        onFormSubmit={this.props.onFormSubmit}
        onTrashClick={this.props.onTrashClick}
        onTypeChange={this.props.onTypeChange}
        onQuantityChange={this.props.onQuantityChange}
      />
    ))

    return (
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        <div>
          {roomTypes}
        </div>
      </Grid>
    )
  }
}

export default EditableRoomTypeList
