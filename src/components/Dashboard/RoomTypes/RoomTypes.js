import React from 'react'
import { withRouter } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import IconButton from '@material-ui/core/IconButton'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import Grid from '@material-ui/core/Grid'

import { errorLogger, objClone } from '../../../utils'
import { apiCache, apiClient } from '../../../utils/api'
import RoomTypeList from './RoomTypeList/RoomTypeList'
import Spinner from '../../base/Spinner/Spinner'

function initRoomTypeObj() {
  const roomTypeObj = {
    id: uuidv4(),

    type: '',
    quantity: 0,
    price: 0,
    amenities: '',
  }

  return roomTypeObj
}

class RoomTypes extends React.Component {
  constructor(props) {
    super(props)

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
    roomTypeToUpdate[propName] = newValue

    this.updateRoomType(roomTypeToUpdate)
  }

  getRoomTypes = () => {
    this.setState({
      roomTypes: apiCache.getRoomTypes(),
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

  createRoomType = () => {
    const newRoomType = initRoomTypeObj()

    this.setState({
      roomTypes: this.state.roomTypes.concat(newRoomType),
    })

    apiClient.createRoomType(newRoomType)
      .then((attrs) => {
        if (this._isDestroyed) return

        this.setState({
          roomTypes: this.state.roomTypes.map((roomType) => {
            if (roomType.id === newRoomType.id) {
              const _roomType = Object.assign(
                {},
                objClone(roomType),
                {
                  id: attrs.id,
                }
              )

              return _roomType
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

  updateRoomType = (attrs) => {
    this.setState({
      roomTypes: this.state.roomTypes.map((roomType) => {
        if (roomType.id === attrs.id) {
          const _roomType = Object.assign(
            {},
            objClone(roomType),
            {
              quantity: attrs.quantity,
              type: attrs.type,
              price: attrs.price,
              amenities: attrs.amenities,
            }
          )

          return _roomType
        } else {
          return roomType
        }
      }),
    })

    apiClient
      .updateRoomType(attrs)
      .catch((error) => {
        if (this._isDestroyed) return

        errorLogger(error)
      })
  }

  deleteRoomType = (id) => {
    this.setState({
      roomTypes: this.state.roomTypes.filter(t => t.id !== id),
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
