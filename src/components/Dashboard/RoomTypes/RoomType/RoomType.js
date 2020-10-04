import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'

import TextEditInput from '../TextEditInput/TextEditInput'

const useStyles = () => {
  return {
    grow: {
      flexGrow: 1,
    },
    room_type_card: {
      width: '26em',
      marginTop: '1em',
      marginBottom: '1em',
    },
  }
}

class RoomType extends React.Component {
  handleTrashClick = () => {
    this.props.onTrashClick(this.props.id)
  }

  handleTypeChange = (e) => {
    this.props.onTypeChange(this.props.id, e)
  }

  handleQuantityChange = (e) => {
    this.props.onQuantityChange(this.props.id, e)
  }

  render() {
    const { classes } = this.props

    return (
      <Card className={classes.room_type_card}>
        <CardContent>
          <TextEditInput
            value={this.props.type}
            label="Type"
            onValueChange={this.handleTypeChange}
          />

          <TextEditInput
            value={this.props.quantity}
            label="Quantity"
            onValueChange={this.handleQuantityChange}
          />
        </CardContent>
        <CardActions>
          <div className={classes.grow}></div>

          <IconButton aria-label="edit" onClick={this.props.onEditClick}>
            <EditIcon />
          </IconButton>

          <IconButton aria-label="delete" onClick={this.handleTrashClick}>
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Card>
    )
  }
}

export default withStyles(useStyles)(RoomType)
