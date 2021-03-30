import React, {useEffect, useState} from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import CardActions from "@material-ui/core/CardActions";
import {
  Button,
  TextField
} from "@material-ui/core";

import makeStyles from "@material-ui/core/styles/makeStyles";
import IconButton from "@material-ui/core/IconButton";
import {PageContentWrapper} from "../../base/Common/PageContentWrapper";
import Typography from "@material-ui/core/Typography";
import {apiClient} from "../../../utils/api";
import {errorLogger, objClone} from "../../../utils/functions";
import {ApiCache} from "../../../utils/api_cache";
import Spinner from "../../base/Spinner/Spinner";
import {isEmpty} from "../../../utils/validationUtils";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import UseMapEventsHook from "./UseMapEventsHook";
import ImagesGallery from '../../base/Images/ImagesGallery';
import DropzoneField from '../../base/DropzoneField'


const useStyles = makeStyles({
  formTitle: {
    fontSize: '22px',
    fontWeight: 'bold'
  },
  sectionLabel: {
    color: '#000000',
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '16px'
  },
  removeButton: {
    marginLeft: '16px'
  },
  mapContainer: {
    width: '100%',
    height: '300px',
    marginTop: '1.5em',
  },
  mapHint: {
    textAlign: 'center',
  },
});
const apiCache = ApiCache.getInstance()


export const Profile = ({userProfile}) => {
  const [isLoadInProgress, setLoadInProgress] = useState(false)
  const [hotel, setHotel] = useState()
  const [validationErrors, setValidationErrors] = useState({})
  const classes = useStyles();
  const [snackWarn, setSnackWarn] = useState();
  const [imagesUploading, setImagesUploading] = useState(false);

  console.log('Hotel:', hotel)
  console.log('profile:',userProfile)

  useEffect(() => {
    console.log('useEffect, userProfile:', userProfile)
    if(!userProfile){
      setSnackWarn('Unknown profile. Please sign out and sign in once again');
      return;
    }

    //get hotel from cache
    let record = apiCache.getHotel()
    console.log('useEffect, record from cache:', record)
    if (record) {
      setHotel(record)
    }
    //...and then from server too
    apiClient.getHotel(userProfile.hotelId)
        .then(record=>{
          console.log('useEffect, record from database:', record)
          setHotel(record)
        })
        .catch(error => {
          errorLogger(error)
              .then(message=>setSnackWarn(message));
        })

  }, [userProfile])

  function handleSave(record) {
    setLoadInProgress(true)
    apiCache.updateHotel(userProfile.hotelId, record)
    delete record.id;
    //existing record is being saved - PATCH it to server
    apiClient.updateHotel(userProfile.hotelId, record)
        .then((record) => {
          setHotel(record)
        })
        .catch((error) => {
          errorLogger(error)
              .then(message => setSnackWarn(message));
        })
        .finally(() => {
          setLoadInProgress(false)
        })
  }

  const validate = (field, returnErrors = false) => {
    const errors = {}
    switch (field) {
      case 'name':
        isEmpty(hotel.name) && (errors[field] = 'Required field');
        break;
      case 'description':
        isEmpty(hotel.description) && (errors[field] = 'Required field');
        break;
      case 'email':
        isEmpty(hotel.email) && (errors[field] = 'Required field');
        break;
      case 'phone':
        isEmpty(hotel.phone) && (errors[field] = 'Required field');
        break;
      case 'address':
        isEmpty(hotel.address) && (errors[field] = 'Required field');
        break;
      case 'imageUrl':
        isEmpty(hotel.imageUrl) && (errors[field] = 'Required field');
        break;
      case 'locationStr':
        isEmpty(hotel.locationStr) && (errors[field] = 'Required field');
        break;
      default:
    }
    if (returnErrors) {
      return errors;
    } else {
      setValidationErrors(errors);
    }
  };

  const validateForm = () =>{
    let errors = Object
        .keys(hotel)
        .map(key => validate(key, true))
        .filter(e => Object.keys(e).length > 0)
        .reduce(
            (a, v) => ({
              ...a,
              ...v
            }),
            {}
        );
    setValidationErrors(errors)
    return Object.keys(errors).length===0;
  }
  function save() {
    if(!validateForm()){
      setSnackWarn('Please fill all required fields properly');
      return;
    }
    handleSave(hotel);
  }
  const handlePropertyChange = (fieldName, value) => {
    console.log('handlePropertyChange, field:',fieldName,' value:',value)
    const newRecord = objClone(hotel)
    newRecord[fieldName] = value;
    setHotel(newRecord);
  }

  const onWarnSnackClose = () => {
    setSnackWarn(false);
  }
  const getLocationStr = () => {
    if(hotel && hotel.location){
      return `${hotel.location.lat}, ${hotel.location.lng}`
    }
    return '';
  }

  const setLocation = (newLocation) => {
    console.log('setLocation:', newLocation)
    handlePropertyChange('location', newLocation);
  }

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
          ...hotel,
          images: [
            ...(Array.isArray(hotel.images) ? hotel.images : []),
            ...response.map(r => r.imageUrl)
          ]
        };
        setHotel(newRoomType);
      })
      .catch(error => {
        setImagesUploading(false);
        errorLogger(error)
          .then(message => setSnackWarn(message))
      })
  };

  const handleImageChange = images => {
    const newHotel = {
      ...hotel,
      images
    };
    setHotel(newHotel);
  };


  if (!hotel || !hotel.id) {
    return (
        <Spinner info="loading" />
    );
  }
  return (
      <PageContentWrapper formTitle='Hotel profile'>
        <form noValidate autoComplete="off">
          <Card>
            <CardContent>
              <Grid
                  container
                  justify="flex-start"
                  alignItems="stretch"
                  spacing={2}
              >
                <Grid item xs={12}>
                  <Typography className={classes.formTitle}>
                    Info
                  </Typography>
                  <TextField
                      value={hotel.name}
                      color="secondary"
                      variant="outlined"
                      label="Hotel Name"
                      fullWidth
                      autoFocus={true}
                      helperText={validationErrors['name']}
                      error={validationErrors['name']!==undefined}
                      onBlur={()=>validate('name')}
                      onChange={(e) => handlePropertyChange('name',e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                      value={hotel.description}
                      color="secondary"
                      variant="outlined"
                      label="Description"
                      onChange={(e) => handlePropertyChange('description',e.target.value)}
                      onBlur={() => validate('description')}
                      helperText={validationErrors['description']}
                      error={validationErrors['description'] !== undefined}
                      multiline
                      rows={4}
                      fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                      value={hotel.address}
                      color="secondary"
                      variant="outlined"
                      label="Address"
                      fullWidth
                      helperText={validationErrors['address']}
                      error={validationErrors['address']!==undefined}
                      onBlur={()=>validate('address')}
                      onChange={(e) => handlePropertyChange('address',e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography className={classes.sectionLabel}>
                    Contact
                  </Typography>

                  <TextField
                      value={hotel.email}
                      color="secondary"
                      variant="outlined"
                      label="email"
                      fullWidth
                      helperText={validationErrors['email']}
                      error={validationErrors['email']!==undefined}
                      onBlur={()=>validate('email')}
                      onChange={(e) => handlePropertyChange('email',e.target.value)}
                  />
                </Grid>
                {/*
                        <Grid item xs={12}>
                            <TextField
                                value={hotel.phone}
                                color="secondary"
                                variant="outlined"
                                label="Phone"
                                fullWidth
                                helperText={validationErrors['phone']}
                                error={validationErrors['phone']!==undefined}
                                onBlur={()=>validate('phone')}
                                onChange={(e) => handlePropertyChange('phone',e.target.value)}
                            />
                        </Grid>
*/}
                <Grid item xs={12}>
                  <TextField
                      value={getLocationStr()}
                      color="secondary"
                      variant="outlined"
                      label="GPS Coordinates"
                      fullWidth
                      disabled={true}
                  />
                </Grid>
                <Grid item xs={12}>
                  <div>
                    Please select on the map where your hotel is located.
                  </div>
                  <MapContainer
                      center={hotel.location}
                      zoom={13}
                      scrollWheelZoom={true}
                      className={classes.mapContainer}
                  >
                    <UseMapEventsHook setPosition={setLocation} />
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={hotel.location}>
                      <Popup>{(hotel.name) ? hotel.name : 'Hotel'}</Popup>
                    </Marker>
                  </MapContainer>


                </Grid>
                <Grid item xs={12}>
                  <Typography className={classes.sectionLabel}>
                    Images
                  </Typography>
                  {/* <TextField
                      value={hotel.imageUrl}
                      color="secondary"
                      variant="outlined"
                      label="Image URL"
                      fullWidth
                      helperText={validationErrors['imageUrl']}
                      error={validationErrors['imageUrl']!==undefined}
                      onBlur={()=>validate('imageUrl')}
                      onChange={(e) => handlePropertyChange('imageUrl',e.target.value)}
                  /> */}
                  <ImagesGallery
                    images={hotel.images}
                    onChange={handleImageChange}
                  />
                  <DropzoneField
                    note={
                      Array.isArray(hotel.images) && hotel.images.length === 0
                        ? 'Add pictures here'
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
                  onClick={save}
                  variant='contained'
                  fullWidth={true}
                  disabled={isLoadInProgress}
                  color={"secondary"}
                  style={{justifyContent: "flex-start"}}
                  endIcon={isLoadInProgress && <CircularProgress size={24}/>}
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
        </form>
      </PageContentWrapper>
  )
}



export default Profile;