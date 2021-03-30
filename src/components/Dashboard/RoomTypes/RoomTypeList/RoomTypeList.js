import React from 'react'

import RoomTypeCard from '../RoomTypeCard/RoomTypeCard'

const RoomTypeList = props => {
  const { roomTypes } = props;

  return (
        <>
          {roomTypes.map((roomType, index) => (
          <RoomTypeCard
            key={index}
            roomType={roomType}
          />
        ))}
        </>
  );
}

export default RoomTypeList
