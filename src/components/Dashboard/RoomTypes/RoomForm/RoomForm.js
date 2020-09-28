import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

const useStyles = () => {
  return {
    room_card: {
      width: '26em',
      marginTop: '1em',
      marginBottom: '1em',
    },
  };
};

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
    const { classes } = this.props;

    return (
      <Card className={classes.room_card}>
        <CardContent>
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
            </div>
          </CardContent>
          <CardActions>
            <Button
              variant="contained" color="primary"
              onClick={this.handleSubmit}
            >
              {submitText}
            </Button>
            <Button
              variant="contained" color="primary"
              onClick={this.props.onFormClose}
            >
              Cancel
            </Button>
          </CardActions>
      </Card>
    );
  }
}

export default withStyles(useStyles)(RoomForm)
