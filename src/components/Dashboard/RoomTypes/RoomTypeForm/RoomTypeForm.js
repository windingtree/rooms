import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'

const useStyles = () => {
  return {
    room_type_card: {
      width: '26em',
      marginTop: '1em',
      marginBottom: '1em',
    },
  }
}

class RoomTypeForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      id: this.props.id || null,
      quantity: this.props.quantity || 0,
      type: this.props.type || '',
      price: this.props.price || 0,
    }
  }

  handleQuantityChange = (e) => {
    this.setState({ quantity: e.target.value })
  }

  handleTypeChange = (e) => {
    this.setState({ type: e.target.value })
  }

  handleSubmit = () => {
    this.props.onFormSubmit({
      id: this.state.id,
      quantity: this.state.quantity,
      type: this.state.type,
      price: this.state.price,
    })
  }

  render() {
    const submitText = this.props.id ? 'Update' : 'Create'
    const { classes } = this.props

    return (
      <Card className={classes.room_type_card}>
        <CardContent>
          <div>
            <label>Type</label>
            <input
              type='text'
              value={this.state.type}
              onChange={this.handleTypeChange}
            />
          </div>
          <div>
            <label>Quantity</label>
            <input
              type='text'
              value={this.state.quantity}
              onChange={this.handleQuantityChange}
            />
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
    )
  }
}

export default withStyles(useStyles)(RoomTypeForm)
