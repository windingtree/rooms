import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import { helpers } from '../../../../utils/helpers';
import RoomActionButton from '../RoomActionButton/RoomActionButton';

const useStyles = () => {
  return {
    room_card: {
      width: '26em',
      marginTop: '1em',
      marginBottom: '1em',
    },
  };
};

class Room extends React.Component {
  handleStartClick = () => {
    this.props.onStartClick(this.props.id);
  };

  handleStopClick = () => {
    this.props.onStopClick(this.props.id);
  };

  handleTrashClick = () => {
    this.props.onTrashClick(this.props.id);
  };

  render() {
    const { classes } = this.props;

    const statusString = helpers.renderStatusString(
      this.props.isEmpty
    );

    return (
      <Card className={classes.room_card}>
        <CardContent>
          <div>
            Room number: {this.props.roomNumber}
          </div>
          <div>
            Type: {this.props.roomType}
          </div>
          <div>
            <h2>
              {statusString}
            </h2>
          </div>
          <div>
            <IconButton aria-label="edit" onClick={this.props.onEditClick}>
              <EditIcon />
            </IconButton>

            <IconButton aria-label="delete" onClick={this.handleTrashClick}>
              <DeleteIcon />
            </IconButton>
          </div>
        </CardContent>
        <CardActions>
          <RoomActionButton
            roomIsEmpty={this.props.isEmpty}
            onStartClick={this.handleStartClick}
            onStopClick={this.handleStopClick}
          />
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(useStyles)(Room)
