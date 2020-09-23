import React from 'react';

class RoomActionButton extends React.Component {
  render() {
    if (this.props.roomIsEmpty === 0) {
      return (
        <div
          className='ui bottom attached red basic button'
          onClick={this.props.onStopClick}
        >
          Check Out
        </div>
      );
    } else if (this.props.roomIsEmpty === 1) {
      return (
        <div
          className='ui bottom attached green basic button'
          onClick={this.props.onStartClick}
        >
          Check In
        </div>
      );
    }
  }
}

export default RoomActionButton
