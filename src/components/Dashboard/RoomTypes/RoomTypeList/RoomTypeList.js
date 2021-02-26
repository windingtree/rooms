import React from 'react'
import Grid from '@material-ui/core/Grid'

import RoomType from '../RoomType/RoomType'

class RoomTypeList extends React.Component {
  render() {
    const roomTypes = this.props.roomTypes.map((roomType) => (
      <RoomType
        key={roomType.id}
        id={roomType.id}

        quantity={roomType.quantity}
        type={roomType.type}
        price={roomType.price}
        creating={roomType.creating}

        guestsNumber={roomType.guestsNumber}
        childFriendly={roomType.childFriendly}
        petFriendly={roomType.petFriendly}

        onEditClick={this.props.onEditClick}
        onTrashClick={this.props.onTrashClick}
        onPropValueChange={this.props.onPropValueChange}
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

export default RoomTypeList
