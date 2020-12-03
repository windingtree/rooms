import React from 'react'
import { withRouter } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import IconButton from '@material-ui/core/IconButton'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import Grid from '@material-ui/core/Grid'

import { errorLogger, objClone, removeProp } from '../../../utils/functions'
import { apiClient } from '../../../utils/api'
import { ApiCache } from '../../../utils/api_cache'
import RoomTypeList from './RoomTypeList/RoomTypeList'
import Spinner from '../../base/Spinner/Spinner'

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

  handleAddNewClick = () => {
    this.createRoomType()
  }

  handleEditClick = (id) => {
    this.props.history.push(`/dashboard/room-types/${id}`)
  }

  handleTrashClick = (id) => {
    this.deleteRoomType(id)
  }

  handlePropValueChange = (id, propName, newValue) => {
    const roomTypeToUpdate = this.state.roomTypes.find((roomType) => {
      if (roomType.id === id) {
        return true
      }

      return false
    })

    if (roomTypeToUpdate[propName] === newValue) {
      return
    }

    const data = {}
    data[propName] = newValue

    this.updateRoomType(id, data)
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

  initRoomTypeObj = () => {
    const roomTypeObj = {
      id: uuidv4(),
      creating: true,

      hotelId: this.props.userProfile.hotelId,

      type: '',
      quantity: 0,
      price: 0,
      amenities: '',
      imageUrl: '',
    }

    return roomTypeObj
  }

  createRoomType = () => {
    const newRoomType = this.initRoomTypeObj()

    this.setState({
      roomTypes: this.state.roomTypes.concat(newRoomType),
    })

    apiClient.createRoomType(removeProp(objClone(newRoomType), 'id', 'creating'))
      .then((createdRoomType) => {
        if (this._isDestroyed) return

        this.setState({
          roomTypes: this.state.roomTypes.map((roomType) => {
            if (roomType.id === newRoomType.id) {
              return createdRoomType
            } else {
              return roomType
            }
          }),
        })
      })
      .catch((error) => {
        if (this._isDestroyed) return

        errorLogger(error)
      })
  }

  updateRoomType = (id, data) => {
    this.setState({
      roomTypes: this.state.roomTypes.map((roomType) => {
        if (roomType.id === id) {
          const _roomType = Object.assign(
            {},
            objClone(roomType),
            objClone(data)
          )

          return _roomType
        } else {
          return roomType
        }
      }),
    })

    apiClient
      .updateRoomType(id, data)
      .catch((error) => {
        if (this._isDestroyed) return

        errorLogger(error)
      })
  }

  deleteRoomType = (id) => {
    this.setState({
      roomTypes: this.state.roomTypes.filter(roomType => roomType.id !== id),
    })

    apiClient
      .deleteRoomType(id)
      .catch((error) => {
        if (this._isDestroyed) return

        errorLogger(error)
      })
  }

  render() {
    return (
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        style={{ minHeight: '100%' }}
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
                onEditClick={this.handleEditClick}
                onTrashClick={this.handleTrashClick}
                onPropValueChange={this.handlePropValueChange}
              />
              <IconButton aria-label="edit" onClick={this.handleAddNewClick}>
                <AddCircleIcon />
              </IconButton>
            </Grid>
        }
      </Grid>
    )
  }
}

export default withRouter(RoomTypes)
