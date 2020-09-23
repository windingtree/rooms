import React from 'react';

import EditableRoom from '../EditableRoom/EditableRoom';

class EditableRoomList extends React.Component {
  render() {
    const timers = this.props.timers.map((timer) => (
      <EditableRoom
        key={timer._id}
        id={timer._id}
        roomNumber={timer.roomNumber}
        roomType={timer.roomType}
        elapsed={timer.elapsed}
        runningSince={timer.runningSince}
        onFormSubmit={this.props.onFormSubmit}
        onTrashClick={this.props.onTrashClick}
        onStartClick={this.props.onStartClick}
        onStopClick={this.props.onStopClick}
      />
    ));
    return (
      <div id='timers'>
        {timers}
      </div>
    );
  }
}

export default EditableRoomList
