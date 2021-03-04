import React from 'react'

import RoomTypeCard from '../RoomTypeCard/RoomTypeCard'

const RoomTypeList = props => {
  const { roomTypes, onDelete = () => {} } = props;

  return (
        <>
          {roomTypes.map((roomType, index) => (
          <RoomTypeCard
            key={index}
            id={roomType.id}
            type={roomType.type}
            onDelete={onDelete}
          />
        ))}
        </>
  );
}

export default RoomTypeList
