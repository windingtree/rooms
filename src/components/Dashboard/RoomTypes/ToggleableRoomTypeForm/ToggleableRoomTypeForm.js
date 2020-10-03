import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import Grid from '@material-ui/core/Grid'

import RoomTypeForm from '../RoomTypeForm/RoomTypeForm'

class ToggleableRoomTypeForm extends React.Component {
  state = {
    isOpen: false,
  }

  handleFormOpen = () => {
    this.setState({ isOpen: true })
  }

  handleFormClose = () => {
    this.setState({ isOpen: false })
  }

  handleFormSubmit = (room) => {
    this.props.onFormSubmit(room)
    this.setState({ isOpen: false })
  }

  render() {
    if (this.state.isOpen) {
      return (
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <RoomTypeForm
            onFormSubmit={this.handleFormSubmit}
            onFormClose={this.handleFormClose}
          />
        </Grid>
      )
    } else {
      return (
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <IconButton aria-label="edit" onClick={this.handleFormOpen}>
            <AddCircleIcon />
          </IconButton>
        </Grid>
      )
    }
  }
}

export default ToggleableRoomTypeForm
