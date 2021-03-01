import React from 'react'
import Grid from '@material-ui/core/Grid'

import RoomTypeCard from '../RoomTypeCard/RoomTypeCard'

const RoomTypeList = props => {
  const { roomTypes, onDelete = () => {} } = props;

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
    >
      <div>
        {roomTypes.map((roomType, index) => (
          <RoomTypeCard
            key={index}
            id={roomType.id}
            type={roomType.type}
            onDelete={onDelete}
          />
        ))}
      </div>
    </Grid>
  );
}

export default RoomTypeList
