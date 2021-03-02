import React from 'react'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import Typography from '@material-ui/core/Typography'

import Spinner from '../../../base/Spinner/Spinner'
import { errorLogger } from '../../../../utils/functions'
import { apiClient } from '../../../../utils/api'

const useStyles = () => {
  return {
    grow: {
      flexGrow: 1,
    },
    room_type_card: {
      width: '600px',
      margin: '16px',
      maxWidth: '90vw'
    },
    price_currency: {
      display: 'inline',
      position: 'relative',
      top: '20px',
      left: '10px',
    },
    cardContent: {
      paddingBottom: '0px'
    }
  }
}

class RoomTypeCard extends React.Component {
  handleTrashClick = () => {
    apiClient
      .deleteRoomType(this.props.id)
      .then(r => {
        this.props.onDelete();
      })
      .catch((error) => {
        if (this._isDestroyed) return

        errorLogger(error)
      })
  }

  handleEditClick = () => {
    this.props.history.push(`/dashboard/room-types/${this.props.id}`)
  }

  render() {
    const { classes } = this.props

    return (
      <Card className={classes.room_type_card}>
        <CardContent className={classes.cardContent}>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="stretch"
          >
            {
              (this.props.creating === true) ?
              <Spinner info="creating" /> :
              <>
                <Grid item>
                  <Typography>
                    {this.props.type}
                  </Typography>
                </Grid>
                <Grid item>
                </Grid>
              </>
            }
          </Grid>
        </CardContent>
        <CardActions>
          {
            (this.props.creating === true)
            ? <></>
            : <>
                <IconButton aria-label="edit" onClick={this.handleEditClick}>
                  <EditIcon />
                </IconButton>
                <div className={classes.grow}></div>
                <IconButton aria-label="delete" onClick={this.handleTrashClick}>
                  <DeleteIcon />
                </IconButton>
              </>
          }
        </CardActions>
      </Card>
    )
  }
}

export default withRouter(withStyles(useStyles)(RoomTypeCard))
