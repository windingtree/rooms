import React from 'react';

import { apiClient } from '../../utils/apiClient';
import { helpers } from '../../utils/helpers';

import EditableRoomList from '../EditableRoomList/EditableRoomList';
import ToggleableRoomForm from '../ToggleableRoomForm/ToggleableRoomForm';

class RoomsDashboard extends React.Component {
  state = {
    timers: [],
  };

  componentDidMount() {
    this.loadTimersFromServer();
    this.loadTimersFromServerInterval = setInterval(this.loadTimersFromServer, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.loadTimersFromServerInterval);
  }

  loadTimersFromServer = () => {
    apiClient.getTimers((serverTimers) => (
        this.setState({ timers: serverTimers })
      )
    );
  };

  handleCreateFormSubmit = (timer) => {
    this.createTimer(timer);
  };

  handleEditFormSubmit = (attrs) => {
    this.updateTimer(attrs);
  };

  handleTrashClick = (timerId) => {
    this.deleteTimer(timerId);
  };

  handleStartClick = (timerId) => {
    this.startTimer(timerId);
  };

  handleStopClick = (timerId) => {
    this.stopTimer(timerId);
  };

  // Inside RoomsDashboard
  // ...
  createTimer = (timer) => {
    const t = helpers.newTimer(timer);
    this.setState({
      timers: this.state.timers.concat(t),
    });

    apiClient.createTimer(t);
  };

  updateTimer = (attrs) => {
    this.setState({
      timers: this.state.timers.map((timer) => {
        if (timer._id === attrs.id) {
          return Object.assign({}, timer, {
            roomNumber: attrs.roomNumber,
            roomType: attrs.roomType,
          });
        } else {
          return timer;
        }
      }),
    });

    apiClient.updateTimer(attrs);
  };

  deleteTimer = (timerId) => {
    this.setState({
      timers: this.state.timers.filter(t => t.id !== timerId),
    });

    apiClient.deleteTimer(
      { id: timerId }
    );
  };

  startTimer = (timerId) => {
    // ...
    const now = Date.now();

    this.setState({
      timers: this.state.timers.map((timer) => {
        if (timer._id === timerId) {
          return Object.assign({}, timer, {
            runningSince: now,
          });
        } else {
          return timer;
        }
      }),
    });

    apiClient.startTimer(
      { id: timerId, start: now }
    );
  };

  stopTimer = (timerId) => {
    const now = Date.now();

    this.setState({
      timers: this.state.timers.map((timer) => {
        if (timer._id === timerId) {
          const lastElapsed = now - timer.runningSince;
          return Object.assign({}, timer, {
            elapsed: timer.elapsed + lastElapsed,
            runningSince: null,
          });
        } else {
          return timer;
        }
      }),
    });

    apiClient.stopTimer(
      { id: timerId, stop: now }
    );
  };

  render() {
    return (
      <div className='ui three column centered grid'>
        <div className='column'>
          <EditableRoomList
            timers={this.state.timers}
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
