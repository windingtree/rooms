import React from 'react';

import EditableRoom from '../EditableRoom/EditableRoom';

class EditableRoomList extends React.Component {
  render() {
    const rooms = this.props.rooms.map((room) => (
      <EditableRoom
        key={room.roomId}
        id={room.roomId}
        roomNumber={room.roomNumber}
        roomType={room.roomType}
        elapsed={room.elapsed}
        isEmpty={room.isEmpty}
        onFormSubmit={this.props.onFormSubmit}
        onTrashClick={this.props.onTrashClick}
        onStartClick={this.props.onStartClick}
        onStopClick={this.props.onStopClick}
      />
    ));
    return (
      <div id='rooms'>
        {rooms}
      </div>
    );
  }
}

export default EditableRoomList
