import React from 'react';
import Grid from '@material-ui/core/Grid';

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
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        <div id='rooms'>
          {rooms}
        </div>
      </Grid>
    );
  }
}

export default EditableRoomList
