import React from 'react';

class RoomForm extends React.Component {
  state = {
    roomNumber: this.props.roomNumber || '',
    roomType: this.props.roomType || '',
    isEmpty: this.props.isEmpty,
  };

  handleRoomNumberChange = (e) => {
    this.setState({ roomNumber: e.target.value });
  };

  handleRoomTypeChange = (e) => {
    this.setState({ roomType: e.target.value });
  };

  handleSubmit = () => {
    this.props.onFormSubmit({
      id: this.props.id,
      roomNumber: this.state.roomNumber,
      roomType: this.state.roomType,
      isEmpty: this.state.isEmpty,
    });
  };

  render() {
    const submitText = this.props.id ? 'Update' : 'Create';
    return (
      <div className='ui centered card'>
        <div className='content'>
          <div className='ui form'>
            <div className='field'>
              <label>Room Number</label>
              <input
                type='text'
                value={this.state.roomNumber}
                onChange={this.handleRoomNumberChange}
              />
            </div>
            <div className='field'>
              <label>Room Type</label>
              <input
                type='text'
                value={this.state.roomType}
                onChange={this.handleRoomTypeChange}
              />
            </div>
            <div className='ui two bottom attached buttons'>
              <button
                className='ui basic blue button'
                onClick={this.handleSubmit}
              >
                {submitText}
              </button>
              <button
                className='ui basic red button'
                onClick={this.props.onFormClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RoomForm
