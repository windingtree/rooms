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

const useStyles = () => {
  return {
    grow: {
      flexGrow: 1,
    },
    room_type_card: {
      marginBottom: '16px',
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
              <>
                <Grid item>
                  <Typography>
                    {this.props.type}
                  </Typography>
                </Grid>
                <Grid item>
                </Grid>
              </>
          </Grid>
        </CardContent>
        <CardActions>
            <>
                <IconButton aria-label="edit" onClick={this.handleEditClick}>
                  <EditIcon />
                </IconButton>
                <IconButton aria-label="delete" onClick={this.handleTrashClick}>
                  <DeleteIcon />
                </IconButton>
              </>
        </CardActions>
      </Card>
    )
  }
}

export default withRouter(withStyles(useStyles)(RoomTypeCard))
