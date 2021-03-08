import React, {useCallback, useEffect, useState} from 'react'
import {useParams, withRouter} from 'react-router-dom'
import {makeStyles, withStyles} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import TextFieldOrig from '@material-ui/core/TextField'
import Snackbar from '@material-ui/core/Snackbar'
import CircularProgress from '@material-ui/core/CircularProgress'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'

import {errorLogger} from '../../../utils/functions'
import {apiClient} from '../../../utils/api'
import {ApiCache} from '../../../utils/api_cache'
import Spinner from '../../base/Spinner/Spinner'
import SelectField from '../../base/SelectField'
import CheckboxField from '../../base/CheckboxField'
import MultiAutocomplete from '../../base/MultiAutocomplete/MultiAutocomplete'
import DropzoneField from '../../base/DropzoneField'
import {PageContentWrapper} from "../../base/Common/PageContentWrapper";

import availableAmenities from '../../../utils/data/availableAmenities.json';
import guestsNumbers from '../../../utils/data/guestsNumbers.json'
import bedsTypes from '../../../utils/data/bedsTypes.json'
import currencies from '../../../utils/data/currencies.json'

const apiCache = ApiCache.getInstance();

const textFieldStyle = () => ({
  root: {
    marginBottom: '16px'
  }
});
const TextField = withStyles(textFieldStyle)(TextFieldOrig);

const useStyles = () => ({
  grow: {
    flexGrow: 1,
  },
  formTitle:{
    fontSize:'22px',
    fontWeight:'bold'
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
  removeButton: {
    marginLeft: '16px'
  },
  cardFooter: {
    marginBottom: '16px'
  },
  imagesContainer: {},
  cardTitle: {
    marginBottom: '16px'
  }
});

const imageStyle = makeStyles({
  removeButton: {
    position: 'absolute',
    top: '-10px',
    right: '-10px',
    backgroundColor: 'rgba(255,255,255,0.7)'
  }
});
const RoomImage = props => {
  const classes = imageStyle();
  const {
    width = 'calc(90vw/4.5)',
    height = 'calc(90vh/10)',
    url,
    onClick = () => {},
    onDelete = () => {}
  } = props;

  const handleImageDelete = e => {
    e.stopPropagation();
    onDelete(url)
  };

  return (
    <div
      style={{
        width,
        height,
        maxWidth: '170px',
        backgroundImage: `url(${url})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        display: 'inline-block',
        margin: '0 16px 16px 0',
        borderRadius: '8px',
        position: 'relative',
        overflow: 'hidden'
      }}
      onClick={() => onClick(url)}
    >
      <IconButton
        className={classes.removeButton}
        aria-label="delete"
        onClick={handleImageDelete}
      >
        <DeleteIcon />
      </IconButton>
    </div>
  );
};

const lightBoxStyle = makeStyles({
  root: {
    padding: 0
  },
  closeButtonWrapper: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    left: 0,
    display: 'flex',
    justifyContent: 'flex-end',
    zIndex: 99999
  },
  closeButton: {
    backgroundColor: 'white'
  },
  prevButton: {
    position: 'absolute',
    top: 0,
    left: '8px',
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyItems: 'center',
    zIndex: 1
  },
  nextButton: {
    position: 'absolute',
    top: 0,
    right: '8px',
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyItems: 'center',
    zIndex: 1
  }
});
const ImageLightBox = props => {
  const classes = lightBoxStyle();
  const {
    images = [],
    index = null,
    alt = 'Room view',
    onClose = () => {},
    onPrev = () => {},
    onNext = () => {}
  } = props;

  return (
    <Dialog
      open={index !== null}
      scroll='paper'
      classes={{
        root: classes.root
      }}
      onBackdropClick={onClose}
    >
      <div className={classes.closeButtonWrapper}>
        <IconButton
          className={classes.closeButton}
          aria-label="close"
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </div>
      <DialogContent
        classes={{
          root: classes.root
        }}
      >
        {images[index] !== 'undefined' &&
          <img
            src={images[index]}
            alt={alt}
          />
        }
        <div className={classes.prevButton}>
          <IconButton
            className={classes.closeButton}
            aria-label="next"
            onClick={onPrev}
          >
            <ArrowBackIosIcon />
          </IconButton>
        </div>
        <div className={classes.nextButton}>
          <IconButton
            className={classes.closeButton}
            aria-label="next"
            onClick={onNext}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const RoomTypeEdit = props => {
  const { roomTypeId } =  useParams();
  const {
    history,
    userProfile,
    classes,
    roomType: roomTypeInit
  } = props;
  const [roomType, setRoomType] = useState(roomTypeInit || null);
  const [validationErrors, setValidationErrors] = useState({});
  const [snackWarn, setSnackWarn] = useState();
  const [loading, setLoading] = useState(false);
  const [imagesUploading, setImagesUploading] = useState(false);
  const [showImage, setShowImage] = useState(null);
  const editMode = roomTypeId !== 'temporary';
  const getRoomType = useCallback(roomTypeId => {
    const _roomType = apiCache.getRoomType(roomTypeId)

    if (_roomType) {
      setRoomType(_roomType)
    }

    apiClient
      .getRoomType(roomTypeId)
      .then(setRoomType)
      .catch(errorLogger)
  }, []);

  useEffect(() => {
    if (editMode) {
      getRoomType(roomTypeId);
    } else {
      setRoomType({
        hotelId: userProfile.hotelId,
        type: '',
        description: '',
        guestsNumber: '',
        childFriendly: false,
        petFriendly: false,
        beds: [''],
        quantity: '',
        price: '',
        currency: 'USD',
        images: [],
        amenities: ''
      });
    }
  }, [getRoomType, roomTypeId, editMode, userProfile]);

  if (!roomType) {
    return (
      <Spinner info="loading" />
    );
  }

  const validate = (field, returnErrors = false) => {
    const errors = {}

    switch (field) {
      case 'type':
        if (typeof roomType.type !== 'string' || roomType.type === '') {
          errors[field] = 'Required field';
        }
        break;
      case 'description':
        if (typeof roomType.description !== 'string' || roomType.description === '') {
          errors[field] = 'Required field';
        }
        break;
      case 'guestsNumber':
        if (typeof roomType.guestsNumber !== 'number' || roomType.guestsNumber === 0) {
          errors[field] = 'Please select a number of guests';
        }
        break;
      case 'childFriendly':
        if (typeof roomType.childFriendly !== 'boolean') {
          errors[field] = 'Wrong field type';
        }
        break;
      case 'petFriendly':
        if (typeof roomType.petFriendly !== 'boolean') {
          errors[field] = 'Wrong field type';
        }
        break;
      case 'beds':
        if (roomType.beds.length === 0 || (roomType.beds.length === 1 && roomType.beds[0] === '')) {
          errors[field] = 'At least on bed type should be selected';
        }
        break;
      case 'quantity':
        if (typeof roomType.quantity !== 'number' || roomType.price === 0) {
          errors[field] = 'Please set a price for the room type';
        }
        break;
      case 'price':
        if (typeof roomType.price !== 'number' || roomType.price === 0) {
          errors[field] = 'Please set a price for the room type';
        }
        break;
      case 'currency':
        if (typeof roomType.currency !== 'string' || roomType.currency === '') {
          errors[field] = 'Please set a currency of the price';
        }
        break;
      default:
    }


    if (returnErrors) {
      return errors;
    } else {
      setValidationErrors(errors);
    }
  };

  const deleteRoomType = id => {
    apiClient
      .deleteRoomType(id)
      .then(() => {
        history.push('/dashboard/room-types')
      })
      .catch(error => {
        errorLogger(error);
        setSnackWarn(error.message);
      })
  }

  const handleAddBed = () => {
    const newRoomType = {
      ...roomType,
      beds: [
        ...roomType.beds,
        ''
      ]
    };
    setRoomType(newRoomType);
  };

  const handleRemoveBed = bedIndex => {
    const newRoomType = {
      ...roomType,
      beds: roomType.beds.filter((_, index) => index !== bedIndex)
    };
    setRoomType(newRoomType);
  };

  const handleBedsChange = (value, index) => {
    const newRoomType = {
      ...roomType,
      beds: roomType.beds.map(
        (oldValue, i) => i === index ? value : oldValue
      )
    };
    setRoomType(newRoomType);
  }

  const handleTypeChange = (e) => {
    const newRoomType = {
      ...roomType,
      type: e.target.value
    };
    setRoomType(newRoomType);
  }

  const handleDescriptionChange = (e) => {
    const newRoomType = {
      ...roomType,
      description: e.target.value
    };
    setRoomType(newRoomType);
  }

  const handleQuantityChange = (e) => {
    const value = Number.parseInt(e.target.value, 10);
    const newRoomType = {
      ...roomType,
      quantity: !isNaN(value) ? value : ''
    };
    setRoomType(newRoomType);
  }

  const handlePriceChange = (e) => {
    const value = Number.parseFloat(e.target.value, 10);
    const newRoomType = {
      ...roomType,
      price: !isNaN(value) ? value : ''
    };
    setRoomType(newRoomType);
  }

  const handleCurrencyChange = value => {
    const newRoomType = {
      ...roomType,
      currency: value
    };
    setRoomType(newRoomType);
  }

  const handleGuestsNumberChange = value => {
    const newRoomType = {
      ...roomType,
      guestsNumber: Number.parseInt(value, 10)
    };
    setRoomType(newRoomType);
  }

  const handleChildFriendlyChange = value => {
    const newRoomType = {
      ...roomType,
      childFriendly: value
    };
    setRoomType(newRoomType);
  }

  const handlePetFriendlyChange = value => {
    const newRoomType = {
      ...roomType,
      petFriendly: value
    };
    setRoomType(newRoomType);
  }

  //this will convert array of [{id:'1', name:'amenity1'}] into semicolon separated string (e.g. "amenity1;amenity2')
  const convertChipsToAmenities = chipData => {
    //return empty list in case input is not an array(e.g. in case of new records)
    if(!Array.isArray(chipData)) {
      return '';
    }
    return chipData.reduce((acc, chip) => {
      return `${acc}${chip.name};`
    }, '');
  }

  //this will convert semicolon separated string (e.g. "amenity1;amenity2') to array of [{id:'1', name:'amenity1'}]
  const convertAmenitiesToChips = semicolonSeparatedList => {
    if(!semicolonSeparatedList)
      return [];
    return semicolonSeparatedList.split(';').map(label => {
      return {name: label}
    });
  }

  const handleAmenitiesChange = value => {
    const newRoomType = {
      ...roomType,
      amenities: convertChipsToAmenities(value)
    };
    setRoomType(newRoomType);
  }

  const onWarnSnackClose = () => {
    setSnackWarn(false);
  }

  const handleSaveClick = () => {
    setLoading(true);
    onWarnSnackClose();
    setValidationErrors({});
    const errors = Object
      .keys(roomType)
      .map(key => validate(key, true))
      .filter(e => Object.keys(e).length > 0)
      .reduce(
        (a, v) => ({
          ...a,
          ...v
        }),
        {}
      );

    if (Object.keys(errors).length !== 0) {
      setLoading(false);
      setValidationErrors(errors);
      setSnackWarn('Please fill all required fields properly');
    } else {
      const { id: roomTypeId, ...data } = roomType;
      delete data.id;
      const action = editMode
        ? apiClient.updateRoomType(roomTypeId, data)
        : apiClient.createRoomType(data)
      action
        .then(() => {
          setLoading(false);
          history.push('/dashboard/room-types');
        })
        .catch(error => {
          setLoading(false);
          errorLogger(error)
              .then(message => setSnackWarn(message))

        })
    }
  };

  const chips = convertAmenitiesToChips(roomType.amenities);

  const handleOnImagesLoadError = error => {
    errorLogger(error)
      .then(message => setSnackWarn(message))
  };

  const handleOnImagesLoaded = images => {
    setImagesUploading(true);
    apiClient
      .uploadImages(images)
      .then(response => {
        setImagesUploading(false);
        const newRoomType = {
          ...roomType,
          images: [
            ...roomType.images,
            ...response.map(r => r.imageUrl)
          ]
        };
        setRoomType(newRoomType);
      })
      .catch(error => {
        setImagesUploading(false);
        errorLogger(error)
          .then(message => setSnackWarn(message))
      })
  };

  const handleImageClick = index => {
    setShowImage(index);
  };

  const handleCloseLightBox = () => {
    setShowImage(null);
  };

  const handlePrevImage = () => {
    const prevIndex = showImage - 1;
    setShowImage(prevIndex >= 0
      ? prevIndex
      : 0);
  }

  const handleNextImage = () => {
    const nextIndex = showImage + 1;
    setShowImage(nextIndex <= roomType.images.length - 1
      ? nextIndex
      : roomType.images.length - 1);
  }

  const handleImageDelete = url => {
    const newRoomType = {
      ...roomType,
      images: roomType.images.filter(
        imageUrl => imageUrl !== url
      )
    };
    setRoomType(newRoomType);
  };

  return (
      <PageContentWrapper >
      {roomType &&
        <Card>
          <CardContent>
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="stretch"
              spacing={2}
            >
              <Grid item xs={12}>

                <Grid container
                  className={classes.cardTitle}
                  alignItems="center"
                >
                  <Grid item xs>
                    <Typography className={classes.formTitle}>
                      Unit Type
                    </Typography>
                  </Grid>
                  <Grid item>
                    {editMode &&
                      <IconButton
                        className={classes.removeButton}
                        aria-label="delete"
                        onClick={() => deleteRoomType(roomTypeId)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  </Grid>
                </Grid>

                <TextField
                  value={roomType.type}
                  color="secondary"
                  variant="outlined"
                  label="Name"
                  onChange={handleTypeChange}
                  onBlur={() => validate('type')}
                  helperText={validationErrors['type']}
                  error={validationErrors['type'] !== undefined}
                  fullWidth={true}
                  autoFocus={true}
                />

                <TextField
                  value={roomType.description}
                  color="secondary"
                  variant="outlined"
                  label="Description"
                  onChange={handleDescriptionChange}
                  onBlur={() => validate('description')}
                  helperText={validationErrors['description']}
                  error={validationErrors['description'] !== undefined}
                  fullWidth={true}
                  multiline
                  rows={4}
                />

                <SelectField
                  options={guestsNumbers}
                  value={roomType.guestsNumber}
                  onChange={handleGuestsNumberChange}
                  onBlur={() => validate('guestsNumber')}
                  helperText={validationErrors['guestsNumber']}
                  error={validationErrors['guestsNumber'] !== undefined}
                  label="Number of Guests"
                  fullWidth={true}
                />

                <Grid container direction='row'>
                  <Grid item xs={6}>
                    <CheckboxField
                      label='Child-friendly'
                      name='childFriendly'
                      checked={roomType.childFriendly}
                      onChange={handleChildFriendlyChange}
                      onBlur={() => validate('childFriendly')}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CheckboxField
                      label='Pet-friendly'
                      name='petFriendly'
                      checked={roomType.petFriendly}
                      onChange={handlePetFriendlyChange}
                      onBlur={() => validate('petFriendly')}
                    />
                  </Grid>
                </Grid>

                {roomType.beds.map((bed, index) => (
                  <Grid container key={index}>
                    <Grid item xs>
                      <SelectField
                        key={Math.random()}
                        options={bedsTypes}
                        value={bed}
                        onChange={value => handleBedsChange(value, index)}
                        onBlur={() => validate('beds')}
                        helperText={validationErrors['beds']}
                        error={validationErrors['beds'] !== undefined}
                        label={
                          bed === ''
                            ? 'Choose a bed'
                            : roomType.beds.length === 1
                              ? 'Bed'
                              : `Bed #${index + 1}`
                        }
                        fullWidth={true}
                        bottomMargin={index < roomType.beds.length - 1}
                      />
                    </Grid>
                    <Grid item>
                      {roomType.beds.length > 1 &&
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

                <Typography className={classes.sectionLabel}>
                  Number of Units
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      value={roomType.quantity}
                      color="secondary"
                      variant="outlined"
                      label="Quantity"
                      onChange={handleQuantityChange}
                      onBlur={() => validate('quantity')}
                      helperText={validationErrors['quantity']}
                      error={validationErrors['quantity'] !== undefined}
                      fullWidth={true}
                    />
                  </Grid>
                </Grid>

                <Grid container
                  spacing={2}
                  alignItems='stretch'
                  justify='flex-start'
                >
                  <Grid item xs>
                    <TextField
                      value={roomType.price}
                      color="secondary"
                      variant="outlined"
                      label="Price per Night"
                      onChange={handlePriceChange}
                      onBlur={() => validate('price')}
                      helperText={validationErrors['price']}
                      error={validationErrors['price'] !== undefined}
                    />
                  </Grid>
                  <Grid item xs>
                    <SelectField
                      options={currencies}
                      value={roomType.currency}
                      onChange={handleCurrencyChange}
                      onBlur={() => validate('currency')}
                      helperText={validationErrors['currency']}
                      error={validationErrors['currency'] !== undefined}
                      label='Currency'
                      fullWidth={true}
                    />
                  </Grid>
                </Grid>

                <Typography className={classes.sectionLabel}>
                  Amenities
                </Typography>
                <MultiAutocomplete
                  options={availableAmenities}
                  value={chips}
                  onValueChange={handleAmenitiesChange}
                  onBlur={() => validate('amenities')}
                  helperText={validationErrors['amenities']}
                  error={validationErrors['amenities'] !== undefined}
                  inputLabel="Add amenities"
                />

                <ImageLightBox
                  images={roomType.images}
                  index={showImage}
                  onClose={handleCloseLightBox}
                  onPrev={handlePrevImage}
                  onNext={handleNextImage}
                />
                <Typography className={classes.sectionLabel}>
                  Images
                </Typography>
                <div className={classes.imagesContainer}>
                  {roomType.images.map(((url, index) => (
                    <RoomImage
                      key={index}
                      url={url}
                      onClick={() => handleImageClick(index)}
                      onDelete={handleImageDelete}
                    />
                  )))}
                </div>
                <DropzoneField
                  note={
                    roomType.images.length === 0
                      ? 'Add pictures here, so that the travellers could see what type of room is this'
                      : undefined
                  }
                  title='Upload Images'
                  subTitle='or drag & drop images here'
                  uploading={imagesUploading}
                  onError={handleOnImagesLoadError}
                  onLoad={handleOnImagesLoaded}
                />

              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Button
              aria-label="done"
              onClick={handleSaveClick}
              variant='contained'
              fullWidth={true}
              disabled={loading}
              color={"secondary"}
              style={{justifyContent: "flex-start"}}
              endIcon={loading && <CircularProgress size={24}/>}
            >Save</Button>
            <Snackbar
              open={!!snackWarn}
              message={snackWarn}
              action={
                <IconButton size='small' aria-label='close' color='inherit' onClick={onWarnSnackClose}>
                  <CloseIcon fontSize='small' />
                </IconButton>
              }
            />
          </CardActions>
        </Card>
      }
      </PageContentWrapper>
  )
}

export default withRouter(withStyles(useStyles)(RoomTypeEdit))
