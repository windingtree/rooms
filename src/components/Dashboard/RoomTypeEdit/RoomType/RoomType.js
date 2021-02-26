import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import DoneIcon from '@material-ui/icons/Done'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import TextEditInput from '../../../base/TextEditInput/TextField'
import SelectField from '../../../base/SelectField'
import CheckboxField from '../../../base/CheckboxField'
import MultiAutocomplete from '../../../base/MultiAutocomplete/MultiAutocomplete'
import DropzoneFiled from '../../../base/DropzoneField'

const useStyles = () => ({
  grow: {
    flexGrow: 1,
  },
  room_type_card: {
    // width: '26em',
    margin: '16px'
  },
  price_currency: {
    display: 'inline',
    position: 'relative',
    top: '20px',
    left: '10px',
  },
  sectionLabel: {
    color: '#000000',
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '16px'
  },
  addBedButton: {
    color: '#757575',
    fontSize: '16px',
    fontWeight: 500,
    textTransform: 'none'
  },
  addBedButtonRoot: {
    marginBottom: '16px'
  },
  saveButton: {
    backgroundColor: '#9e21af',
    color: 'white',
    fontSize: '16px',
    padding: '16px',
    marginLeft: '8px',
    '&>span': {
      justifyContent: 'flex-start'
    }
  },
  removeButton: {
    marginLeft: '16px'
  },
  cardFooter: {
    marginBottom: '16px'
  }
});

const RoomType = props => {
  const {
    classes,
    id,
    type,
    description,
    guestsNumber,
    childFriendly = false,
    petFriendly = false,
    quantity,
    beds,
    price,
    currency,
    devConPrice,
    imageUrl,
    amenities,
    onTrashClick,
    onDoneClick,
    onPropValueChange
  } = props;

  const [bedsItems, setBedsItems] = useState(beds);

  const availableAmenities = [
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
  ];
  const guestsNumbers = [
    {
      label: '1 Guest',
      value: 0
    },
    {
      label: '2 Guests',
      value: 1
    },
    {
      label: '3 Guests',
      value: 2
    }
  ];
  const bedsTypes = [
    {
      label: '1 Single bed',
      value: 0
    },
    {
      label: '1 Double bed',
      value: 1
    },
    {
      label: '1 Kingsize bed',
      value: 2
    }
  ];
  const currencies = [
    {
      label: 'USD',
      value: 'USD'
    }
  ];

  const handleTrashClick = () => {
    onTrashClick(id)
  }

  const handleEditClick = () => {
    onDoneClick(id)
  }

  const handleAddBed = () => {
    const newBeds = [
      ...bedsItems,
      ''
    ];
    setBedsItems(newBeds);
    onPropValueChange(id, 'beds', newBeds.filter(item => item !== ''));
  };

  const handleRemoveBed = bedIndex => {
    const newBeds = bedsItems.filter((_, index) => index !== bedIndex);
    setBedsItems(newBeds);
    onPropValueChange(id, 'beds', newBeds.filter(item => item !== ''));
  };

  const handleBedsChange = (value, index) => {
    const newBedsItems = bedsItems.map(
      (oldValue, i) => i === index ? value : oldValue
    );
    setBedsItems(newBedsItems);
    onPropValueChange(id, 'beds', newBedsItems.filter(item => item !== ''))
  }

  const handleTypeChange = (e) => {
    if (e && e.target && typeof e.target.value === 'string') {
      onPropValueChange(id, 'type', e.target.value)
    }
  }

  const handleDescriptionChange = (e) => {
    if (e && e.target && e.target.value) {
      onPropValueChange(id, 'description', e.target.value)
    }
  }

  const handleQuantityChange = (e) => {
    if (e && e.target && typeof e.target.value === 'string' && e.target.value !== '') {
      onPropValueChange(id, 'quantity', Number.parseInt(e.target.value, 10))
    } else {
      onPropValueChange(id, 'quantity', 0)
    }
  }

  const handlePriceChange = (e) => {
    if (e && e.target && typeof e.target.value === 'string' && e.target.value !== '') {
      onPropValueChange(id, 'price', Number.parseFloat(e.target.value, 10))
    } else {
      onPropValueChange(id, 'price', 0)
    }
  }

  const handleCurrencyChange = value => {
    if (typeof value === 'string') {
      onPropValueChange(id, 'currency', value)
    }
  }

  // const handleDevConPriceChange = (e) => {
  //   if (e && e.target && typeof e.target.value === 'number') {
  //     onPropValueChange(id, 'devConPrice', Number.parseFloat(e.target.value, 10))
  //   }
  // }

  // const handleImageUrlChange = (e) => {
  //   if (e && e.target && typeof e.target.value === 'string') {
  //     onPropValueChange(id, 'imageUrl', e.target.value)
  //   }
  // }

  const handleGuestsNumberChange = value => {
    if (typeof value === 'number') {
      onPropValueChange(id, 'guestsNumber', Number.parseInt(value, 10))
    }
  }

  const handleChildFriendlyChange = value => {
    onPropValueChange(id, 'childFriendly', value)
  }

  //this will convert array of [{id:'1', name:'amenity1'}] into semicolon separated string (e.g. "amenity1;amenity2')
  const convertChipsToAmenities = chipData => {
    //return empty list in case input is not an array(e.g. in case of new records)
    if(!Array.isArray(chipData)) {
      return "";
    }
    const semicolonSeparatedList = chipData.reduce((acc, chip) => {
       return `${acc}${chip.name};`
     }, '')
    return semicolonSeparatedList;
  }

  //this will convert semicolon separated string (e.g. "amenity1;amenity2') to array of [{id:'1', name:'amenity1'}]
  const convertAmenitiesToChips = semicolonSeparatedList => {
    if(!semicolonSeparatedList)
      return [];
    const chips = semicolonSeparatedList.split(';').map(label=>{return {name:label}})
    return chips;
  }

  const handleAmenitiesChange = e => {
    const semicolonSeparatedList = convertChipsToAmenities(e)
    onPropValueChange(id, 'amenities', semicolonSeparatedList)
  }

  const handlePetFriendlyChange = value => {
    onPropValueChange(id, 'petFriendly', value)
  }

  const chips = convertAmenitiesToChips(amenities);

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
            <Typography className={classes.sectionLabel}>
              Unit Type
            </Typography>
            <TextEditInput
              value={type}
              label="Name"
              onChange={handleTypeChange}
              fullWidth={true}
              autoFocus={true}
            />
            <TextEditInput
              value={description}
              label="Description"
              onChange={handleDescriptionChange}
              fullWidth={true}
              multiline
              rows={4}
            />
            <SelectField
              options={guestsNumbers}
              value={guestsNumber}
              onChange={handleGuestsNumberChange}
              label="Number of Guests"
              fullWidth={true}
            />
            <Grid container direction='row'>
              <Grid item xs={6}>
                <CheckboxField
                  label='Child-friendly'
                  name='childFriendly'
                  checked={childFriendly}
                  onChange={handleChildFriendlyChange}
                />
              </Grid>
              <Grid item xs={6}>
                <CheckboxField
                  label='Pet-friendly'
                  name='petFriendly'
                  checked={petFriendly}
                  onChange={handlePetFriendlyChange}
                />
              </Grid>
            </Grid>
            {bedsItems.map((bed, index) => (
              <Grid container key={index}>
                <Grid item xs>
                  <SelectField
                    key={Math.random()}
                    options={bedsTypes}
                    value={bed}
                    onChange={value => handleBedsChange(value, index)}
                    label={
                      bed === ''
                        ? 'Choose a bed'
                        : bedsItems.length === 1
                          ? 'Bed'
                          : `Bed #${index + 1}`
                    }
                    fullWidth={true}
                    bottomMargin={index < bedsItems.length - 1}
                  />
                </Grid>
                <Grid item>
                  {bedsItems.length > 1 &&
                    <IconButton aria-label="delete" onClick={() => handleRemoveBed(index)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                </Grid>
              </Grid>
            ))}
            <Button
              classes={{
                text: classes.addBedButton,
                root: classes.addBedButtonRoot
              }}
              variant='text'
              onClick={handleAddBed}
            >
              + Add another bed or a couch
            </Button>
          </Grid>
          <Grid item>
            <Typography className={classes.sectionLabel}>
              Number of Units
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextEditInput
                  value={quantity}
                  label="Quantity"
                  onChange={handleQuantityChange}
                  fullWidth={true}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextEditInput
                  value={price}
                  label="Price per Night"
                  onChange={handlePriceChange}
                />
              </Grid>
              <Grid item xs={6}>
                <SelectField
                  options={currencies}
                  value={currency}
                  onChange={handleCurrencyChange}
                  label='Currency'
                  fullWidth={true}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Typography className={classes.sectionLabel}>
              Amenities
            </Typography>
            <MultiAutocomplete
              options={availableAmenities}
              value={chips}
              onValueChange={handleAmenitiesChange}
              inputLabel="Add amenities"
            />
          </Grid>
          {/* <Grid item>
            <TextEditInput
              value={devConPrice}
              label="DevCon Price"
              onChange={handleDevConPriceChange}
            />
            <div className={classes.price_currency}>USD</div>
          </Grid> */}
          <Grid item>
            <Typography className={classes.sectionLabel}>
              Images
            </Typography>
            {/* <TextEditInput
              value={imageUrl}
              label="Image URL"
              onChange={handleImageUrlChange}
              fullWidth={true}
            /> */}
            <DropzoneFiled
              note={'Add pictures here, so that the travellers could see what type of room is this'}
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Grid container
          alignItems='center'
          className={classes.cardFooter}
        >
          <Grid item xs>
            <Button
              className={classes.saveButton}
              aria-label="done"
              onClick={handleEditClick}
              variant='contained'
              fullWidth={true}
            >
              Save
            </Button>
          </Grid>
          <Grid item>
            <IconButton
              className={classes.removeButton}
              aria-label="delete"
              onClick={handleTrashClick}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
}

export default withStyles(useStyles)(RoomType)
