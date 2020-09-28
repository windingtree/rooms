import React from 'react';
import Button from '@material-ui/core/Button';

class RoomActionButton extends React.Component {
  render() {
    if (this.props.roomIsEmpty === 0) {
      return (
        <Button
          variant="contained" color="secondary"
          onClick={this.props.onStopClick}
        >
          Check Out
        </Button>
      );
    } else if (this.props.roomIsEmpty === 1) {
      return (
        <Button
          variant="contained" color="primary"
          onClick={this.props.onStartClick}
        >
          Check In
        </Button>
      );
    }
  }
}

export default RoomActionButton
