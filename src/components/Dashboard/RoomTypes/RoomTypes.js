import React from 'react'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

import { errorLogger } from '../../../utils/functions'
import { apiClient } from '../../../utils/api'
import { ApiCache } from '../../../utils/api_cache'
import RoomTypeList from './RoomTypeList/RoomTypeList'
import Spinner from '../../base/Spinner/Spinner'

const useStyles = () => ({
  container: {
    minHeight: '100%'
  },
  addButton: {
    backgroundColor: 'white',
    boxShadow: '0px 4px 12px rgba(10, 23, 51, 0.04), 0px 2px 6px rgba(10, 23, 51, 0.04)',
    color: '#9226AD',
    fontSize: '16px',
    fontWeight: 500,
    textTransform: 'none',
    minWidth: '60vw',
    maxWidth: '80vw',
    '&>span': {
      justifyContent: 'flex-start'
    }
  }
});

class RoomTypes extends React.Component {
  constructor(props) {
    super(props)

    this.apiCache = ApiCache.getInstance()

    this._isDestroyed = false
    this.state = {
      roomTypes: [],
      apiLoading: true,
    }
  }

  componentDidMount() {
    this.getRoomTypes()
  }

  componentWillUnmount() {
    this._isDestroyed = true
  }

  handleEditClick = (id) => {
    this.props.history.push(`/dashboard/room-types/${id}`)
  }

  handleTrashClick = (id) => {
    this.deleteRoomType(id)
  }

  handleTypeDelete = () => {
    this.getRoomTypes()
  }

  getRoomTypes = () => {
    this.setState({
      roomTypes: this.apiCache.getRoomTypes(),
      apiLoading: true,
    })

    apiClient
      .getRoomTypes()
      .then((roomTypes) => {
        if (this._isDestroyed) return

        this.setState({
          roomTypes,
          apiLoading: false,
        })
      })
      .catch((error) => {
        if (this._isDestroyed) return

        errorLogger(error)
      })
  }

  render() {
    return (
      <Grid
        className={this.props.classes.container}
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        {
          ((!this.state.roomTypes || !this.state.roomTypes.length) && (this.state.apiLoading)) ?
            <Spinner info="loading" /> :
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <RoomTypeList
                roomTypes={this.state.roomTypes}
                onDelete={this.handleTypeDelete}
              />
              <Button
                className={this.props.classes.addButton}
                aria-label="edit"
                onClick={() => this.handleEditClick('temporary')}
                variant='contained'
              >
                + Add Unit Type
              </Button>
            </Grid>
        }
      </Grid>
    )
  }
}

export default withRouter(withStyles(useStyles)(RoomTypes))
