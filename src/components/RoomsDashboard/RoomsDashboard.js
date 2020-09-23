import React from 'react';

import { apiClient } from '../../utils/apiClient';
import { helpers } from '../../utils/helpers';

import EditableRoomList from '../EditableRoomList/EditableRoomList';
import ToggleableRoomForm from '../ToggleableRoomForm/ToggleableRoomForm';

class RoomsDashboard extends React.Component {
  state = {
    rooms: [],
  };

  componentDidMount() {
    this.loadRoomsFromServer();
  }

  componentWillUnmount() {

  }

  loadRoomsFromServer = () => {
    apiClient.getRooms((serverRooms) => (
        this.setState({ rooms: serverRooms })
      )
    );
  };

  handleCreateFormSubmit = (room) => {
    this.createRoom(room);
  };

  handleEditFormSubmit = (attrs) => {
    this.updateRoom(attrs);
  };

  handleTrashClick = (roomId) => {
    this.deleteRoom(roomId);
  };

  handleStartClick = (roomId) => {
    this.startRoom(roomId);
  };

  handleStopClick = (roomId) => {
    this.stopRoom(roomId);
  };

  createRoom = (room) => {
    const t = helpers.newRoom(room);
    this.setState({
      rooms: this.state.rooms.concat(t),
    });

    apiClient.createRoom(t).then((attrs) => {
      this.setState({
        rooms: this.state.rooms.map((room) => {
          if (room.roomId === t.roomId) {
            return Object.assign({}, room, {
              roomId: attrs.roomId
            });
          } else {
            return room;
          }
        }),
      });
    });
  };

  updateRoom = (attrs) => {
    this.setState({
      rooms: this.state.rooms.map((room) => {
        if (room.roomId === attrs.id) {
          return Object.assign({}, room, {
            roomNumber: attrs.roomNumber,
            roomType: attrs.roomType,
            isEmpty: attrs.isEmpty
          });
        } else {
          return room;
        }
      }),
    });

    apiClient.updateRoom(attrs);
  };

  deleteRoom = (roomId) => {
    this.setState({
      rooms: this.state.rooms.filter(t => t.roomId !== roomId),
    });

    apiClient.deleteRoom(
      { id: roomId }
    );
  };

  startRoom = (roomId) => {
    let updatedRoom;

    this.setState({
      rooms: this.state.rooms.map((room) => {
        if (room.roomId === roomId) {
          updatedRoom = Object.assign({}, room, {
            isEmpty: 0,
          });

          return updatedRoom;
        } else {
          return room;
        }
      }),
    });

    updatedRoom.id = roomId
    apiClient.updateRoom(updatedRoom);
  };

  stopRoom = (roomId) => {
    let updatedRoom;

    this.setState({
      rooms: this.state.rooms.map((room) => {
        if (room.roomId === roomId) {
          updatedRoom = Object.assign({}, room, {
            isEmpty: 1,
          });

          return updatedRoom;
        } else {
          return room;
        }
      }),
    });

    updatedRoom.id = roomId
    apiClient.updateRoom(updatedRoom);
  };

  render() {
    return (
      <div className='ui three column centered grid'>
        <div className='column'>
          <EditableRoomList
            rooms={this.state.rooms}
            onFormSubmit={this.handleEditFormSubmit}
            onTrashClick={this.handleTrashClick}
            onStartClick={this.handleStartClick}
            onStopClick={this.handleStopClick}
          />
          <ToggleableRoomForm
            onFormSubmit={this.handleCreateFormSubmit}
          />
        </div>
      </div>
    );
  }
}

export default RoomsDashboard
