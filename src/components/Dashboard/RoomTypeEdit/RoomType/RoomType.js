import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import DoneIcon from '@material-ui/icons/Done'

import TextEditInput from '../../../base/TextEditInput/TextEditInput'
import MultiAutocomplete from '../../../base/MultiAutocomplete/MultiAutocomplete'

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
    price_currency: {
      display: 'inline',
      position: 'relative',
      top: '20px',
      left: '10px',
    },
  }
}

class RoomType extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      availableAmenities: [
        { name: 'Shuttle Service: Airport - Hotel - Airport, at times established by the hotel' },

        { name: 'Buffet breakfast at the restaurant' },
        { name: 'Spinning Center Gym (Sótano 1) not SPA services' },
        { name: 'Internet (High Speed) y Wi-Fi' },
        { name: '5 first minutes in local calls' },
        { name: 'Business Center 24 hours' },
        { name: 'Safe box, air conditioning, hair dryer, iron and ironing board, laundry services' },
        { name: 'Room service 24 hours' },

        { name: 'American breakfast in the restaurant' },
        { name: 'Spinning Center Gym (Basement Floor) except Spa and Hair Salon Services' },
        { name: 'High Speed Wired Internet and Wi-Fi inside the hotel' },
        { name: '5 minutes of local calls' },
        { name: 'Business Center open 24 hours with printing services' },
        { name: 'Safe deposit box, air conditioning and bioclimatic ventilation' },

        { name: 'Room with Queen Bed' },
        { name: 'Room with double beds' },
        { name: 'Room with three beds' },
        { name: 'Private bathroom with shower' },
        { name: 'Flat screen TV' },
        { name: 'DirecTV cable channels' },

        { name: 'Minibar' },
        { name: 'Exercises room' },
        { name: 'Parking lot' },
        { name: 'Free Wi-Fi throughout the building' },
        { name: 'Security box' },
        { name: 'Free local calls' },
        { name: 'Free amenities' },
        { name: 'Hair dryer' },
        { name: 'Biosafety Certificate "Check In certified"' },
        { name: 'Breakfast included in the rate' },

        { name: 'Gym' },
        { name: 'Spa and wet areas (sauna and Turkish)' },
        { name: 'La Macuira restaurant' },
        { name: 'Free Wi-Fi in rooms and throughout the building' },
        { name: 'Business center' },
        { name: 'Bar - Cafe' },
        { name: 'Parking' },
        { name: 'Biosafety Certificate "Check in certificate"' },
      ],
    }
  }

  handleTrashClick = () => {
    this.props.onTrashClick(this.props.id)
  }

  handleEditClick = () => {
    this.props.onDoneClick(this.props.id)
  }

  handleTypeChange = (e) => {
    this.props.onPropValueChange(this.props.id, 'type', e)
  }

  handleDescriptionChange = (e) => {
    this.props.onPropValueChange(this.props.id, 'description', e)
  }

  handleQuantityChange = (e) => {
    this.props.onPropValueChange(this.props.id, 'quantity', Number.parseInt(e, 10))
  }

  handlePriceChange = (e) => {
    this.props.onPropValueChange(this.props.id, 'price', Number.parseFloat(e, 10))
  }

  handleDevConPriceChange = (e) => {
    this.props.onPropValueChange(this.props.id, 'devConPrice', Number.parseFloat(e, 10))
  }

  handleAmenitiesChange = (e) => {
    this.props.onPropValueChange(this.props.id, 'amenities', e)
  }

  handleImageUrlChange = (e) => {
    this.props.onPropValueChange(this.props.id, 'imageUrl', e)
  }

  render() {
    const { classes } = this.props

    return (
      <Card className={classes.room_type_card}>
        <CardContent>

          <Grid
            container
            direction="column"
            justify="center"
            alignItems="stretch"
          >
            <Grid item>
              <TextEditInput
                value={this.props.type}
                label="Type"
                onValueChange={this.handleTypeChange}
                inputWidth={150}
              />
              <TextEditInput
                value={this.props.quantity}
                label="Quantity"
                onValueChange={this.handleQuantityChange}
                inputWidth={75}
              />
            </Grid>
            <Grid item>
              <TextEditInput
                value={this.props.description}
                label="Description"
                onValueChange={this.handleDescriptionChange}
                inputWidth={300}
              />
            </Grid>
            <Grid item>
              <TextEditInput
                value={this.props.price}
                label="Price"
                onValueChange={this.handlePriceChange}
                inputWidth={90}
              />
              <div className={classes.price_currency}>USD</div>
            </Grid>
            <Grid item>
              <TextEditInput
                value={this.props.devConPrice}
                label="DevCon Price"
                onValueChange={this.handleDevConPriceChange}
                inputWidth={90}
              />
              <div className={classes.price_currency}>USD</div>
            </Grid>
            <Grid item>
              <TextEditInput
                value={this.props.imageUrl}
                label="Image URL"
                onValueChange={this.handleImageUrlChange}
                inputWidth={300}
              />
            </Grid>
            <Grid item>
              <MultiAutocomplete
                options={this.state.availableAmenities}
                value={this.props.amenities}
                onValueChange={this.handleAmenitiesChange}
                inputLabel="Amenities"
                inputWidth={250}
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <IconButton aria-label="done" onClick={this.handleEditClick}>
            <DoneIcon />
          </IconButton>

          <div className={classes.grow}></div>

          <IconButton aria-label="delete" onClick={this.handleTrashClick}>
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Card>
    )
  }
}

export default withStyles(useStyles)(RoomType)
