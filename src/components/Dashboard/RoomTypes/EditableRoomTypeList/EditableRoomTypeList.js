import React from 'react'
import Grid from '@material-ui/core/Grid'

import EditableRoomType from '../EditableRoomType/EditableRoomType'

class EditableRoomTypeList extends React.Component {
  render() {
    const roomTypes = this.props.roomTypes.map((roomType) => (
      <EditableRoomType
        key={roomType.roomId}
        roomId={roomType.roomId}
        roomNumber={roomType.roomNumber}
        roomType={roomType.roomType}
        isEmpty={roomType.isEmpty}
        onFormSubmit={this.props.onFormSubmit}
        onTrashClick={this.props.onTrashClick}
        onRoomTypeChange={this.props.onRoomTypeChange}
        onRoomNumberChange={this.props.onRoomNumberChange}
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
