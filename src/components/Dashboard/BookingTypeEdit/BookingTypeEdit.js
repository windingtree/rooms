import React, {useEffect, useState} from 'react'
import {useHistory, useParams, withRouter} from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import {v4 as uuidv4} from 'uuid'
import {errorLogger, objClone} from '../../../utils/functions'
import {apiClient} from '../../../utils/api'
import {ApiCache} from '../../../utils/api_cache'
import Spinner from '../../base/Spinner/Spinner'
import * as moment from "moment";
import {PageContentWrapper} from "../../base/Common/PageContentWrapper";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import {createMuiTheme, TextField} from "@material-ui/core";
import {isEmpty} from "../../../utils/validationUtils";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import {ThemeProvider} from "@material-ui/core/styles";
import {datePickerThemeObj} from "../../../utils/themes";
import SelectField from "../../base/SelectField";
import {guestsTypes} from "../../../utils/data/index"
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import CardActions from "@material-ui/core/CardActions";

const datePickerTheme = createMuiTheme(datePickerThemeObj)

const apiCache = ApiCache.getInstance();

const useStyles = makeStyles({
    formTitle: {
        fontSize: '22px',
        fontWeight: 'bold'
    },
    room_type_card: {
        width: '600px',
        margin: '16px',
        maxWidth: '90vw'
    },
    sectionLabel: {
        color: '#000000',
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '16px'
    },
    removeButton: {
        marginLeft: '16px'
    }
});


const initializeNewRecord = (userProfile) => {
    return {
        id: uuidv4(),

        hotelId: userProfile.hotelId,
        roomTypeId: '',

        checkInDate: new moment().format(),
        checkOutDate: new moment().add(1, 'days').format(),
        guestName: '',
        guestEmail: '',
        phoneNumber: '',
    }
}

const BookingEdit = ({userProfile}) => {
    const {bookingId} = useParams();
    const history = useHistory()
    const [booking, setBooking] = useState(null);
    const [roomTypes, setRoomTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const editMode = bookingId !== 'temporary';
    const [validationErrors, setValidationErrors] = useState({});
    const classes = useStyles()
    const [snackWarn, setSnackWarn] = useState();


    //load booking
    const fetchBooking = id => {
        const record = apiCache.getBooking(id)
        if (record) {
            setBooking(record)
        }
        apiClient
            .getBooking(id)
            .then((record) => {
                setBooking(record)
            })
            .catch(error=>{
                errorLogger(error)
                setSnackWarn(error.message);
            })
    };

    //load room types
    const fetchRoomTypes = () => {
        const records = apiCache.getRoomTypes()
        if (records) {
            setRoomTypes(records)
        }
        apiClient
            .getRoomTypes()
            .then(setRoomTypes)
            .catch(error=>{
                errorLogger(error)
                    .then(message=>setSnackWarn(message))
            })

    }

    useEffect(() => {
        fetchRoomTypes()
        if (editMode) {
            fetchBooking(bookingId);
        } else {
            setBooking(initializeNewRecord(userProfile))
        }
    }, [bookingId, editMode, userProfile])



    const onWarnSnackClose = () => {
        setSnackWarn(false);
    }

    const deleteBooking = (id) => {
        apiClient
            .deleteBooking(id)
            .then(() => {
                history.push('/dashboard/bookings')
            })
            .catch(error=>{
                errorLogger(error)
                    .then(message=>setSnackWarn(message))

            })

    }

    const validateAllFormFields = () =>{
        return Object
            .keys(booking)
            .map(key => validate(key, true))
            .filter(e => Object.keys(e).length > 0)
            .reduce(
                (a, v) => ({
                    ...a,
                    ...v
                }),
                {}
            );
    }

    const handleSaveClick = () => {
        setLoading(true);
        onWarnSnackClose();
        setValidationErrors({});
        const errors = validateAllFormFields();

        if (Object.keys(errors).length !== 0) {
            setLoading(false);
            setValidationErrors(errors);
            setSnackWarn('Please fill all required fields properly');
        } else {
            const { id: bookingId, ...data } = booking;
            delete data.id;

            //workaround to avoid validation errors
            delete data.guestsNumber;
            delete data.orderId;
            //update cache

            //update backend
            const action = editMode
                ? apiClient.updateBooking(bookingId, data)
                : apiClient.createBooking(data)
            action
                .then(() => {
                    setLoading(false);
                    history.push('/dashboard/bookings');
                })
                .catch(error => {
                    setLoading(false);
                    errorLogger(error)
                        .then(message=>setSnackWarn(message))

                })
        }
    };
    const handlePropertyChange = (fieldName, value) => {
        const newBooking = objClone(booking)
        newBooking[fieldName] = value;
        setBooking(newBooking);
    }
    const validate = (field, returnErrors = false) => {
        const errors = {}
        let yesterday = new moment().subtract(1,'days');
        let checkInDate=moment(booking.checkInDate)
        let checkOutDate=moment(booking.checkOutDate)
        switch (field) {
            case 'checkInDate':
                !checkInDate.isValid() && (errors[field] = 'Invalid date');
                checkInDate.isSameOrBefore(yesterday) && (errors[field] = 'Date in the past');
                break;
            case 'checkOutDate':
                !checkOutDate.isValid() && (errors[field] = 'Invalid date');
                checkOutDate.isSameOrBefore(checkInDate) && (errors[field] = 'Check out date is before check out date');
                break;
            case 'guestName':
                isEmpty(booking.guestName) && (errors[field] = 'Required field');
                break;
            case 'phoneNumber':
                isEmpty(booking.phoneNumber) && (errors[field] = 'Required field');
                break;
            default:
        }

        console.log('Validation Errors', errors);

        if (returnErrors) {
            return errors;
        } else {
            setValidationErrors(errors);
        }
    };

    const convertRoomTypesListToSelectFormat = () => {
        if (!roomTypes)
            return [];
        return roomTypes.map(({id, type}) => {
            return {label: type, value: id}
        });
    }

    console.log('datePickerTheme', datePickerTheme)

    return (

        <PageContentWrapper>
            {
                (!booking) ?
                    <Spinner info="loading"/> :
                    <Card className={classes.room_type_card}>
                        <CardContent>
                            <Grid
                                container
                                direction="column"
                                justify="center"
                                alignItems="stretch"
                                spacing={2}
                            >
                                <Grid item xs={12}>

                                    <Grid container>
                                        <Grid item xs>
                                            <Typography className={classes.formTitle}>
                                                Booking
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            {editMode &&
                                            <IconButton
                                                className={classes.removeButton}
                                                aria-label="delete"
                                                onClick={() => deleteBooking(bookingId)}
                                            >
                                                <DeleteIcon/>
                                            </IconButton>
                                            }
                                        </Grid>
                                    </Grid>


                                </Grid>

                                <Grid item xs={12}>
                                    <Typography className={classes.sectionLabel}>
                                        When
                                    </Typography>
                                    <ThemeProvider theme={datePickerTheme}>
                                        <MuiPickersUtilsProvider utils={MomentUtils}>
                                            <KeyboardDatePicker
                                                disableToolbar
                                                format="DD/MM/yyyy"
                                                margin="normal"
                                                color="secondary"
                                                variant="inline"
                                                label="Check-in"
                                                fullWidth
                                                inputVariant="outlined"
                                                value={booking.checkInDate}
                                                onChange={(e) => handlePropertyChange('checkInDate', e)}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change check-in date',
                                                }}
                                                onBlur={() => validate('checkInDate')}
                                                onClose={() => validate('checkInDate')}
                                                helperText={validationErrors['checkInDate']}
                                                error={validationErrors['checkInDate'] !== undefined}
                                            />

                                        </MuiPickersUtilsProvider>
                                    </ThemeProvider>
                                </Grid>
                                <Grid item xs={12}>
                                    <ThemeProvider theme={datePickerTheme}>
                                        <MuiPickersUtilsProvider utils={MomentUtils}>
                                            <KeyboardDatePicker
                                                disableToolbar
                                                format="DD/MM/yyyy"
                                                margin="normal"
                                                color="secondary"
                                                variant="inline"
                                                label="Check-out"
                                                fullWidth
                                                inputVariant="outlined"
                                                value={booking.checkOutDate}
                                                onChange={(e) => handlePropertyChange('checkOutDate', e)}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change check-out date',
                                                }}
                                                onBlur={() => validate('checkOutDate')}
                                                onClose={() => validate('checkOutDate')}
                                                helperText={validationErrors['checkOutDate']}
                                                error={validationErrors['checkOutDate'] !== undefined}
                                            />

                                        </MuiPickersUtilsProvider>
                                    </ThemeProvider>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography className={classes.sectionLabel}>
                                        Who
                                    </Typography>
                                    <TextField
                                        value={booking.guestName}
                                        color="secondary"
                                        variant="outlined"
                                        label="Name"
                                        onChange={(e) => handlePropertyChange('guestName', e.target.value)}
                                        onBlur={() => validate('guestName')}
                                        helperText={validationErrors['guestName']}
                                        error={validationErrors['guestName'] !== undefined}
                                        fullWidth={true}
                                    />

                                </Grid>
                                <Grid item xs={12}>
                                    <SelectField
                                        options={guestsTypes}
                                        value={booking.guestsNumber}
                                        onBlur={() => validate('guestsNumber')}
                                        onChange={(e) => handlePropertyChange('guestsNumber', e)}
                                        helperText={validationErrors['guestsNumber']}
                                        error={validationErrors['guestsNumber'] !== undefined}
                                        label="Number of Guests"
                                        fullWidth={true}
                                    />


                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        value={booking.phoneNumber}
                                        color="secondary"
                                        variant="outlined"
                                        label="Phone number"
                                        onChange={(e) => handlePropertyChange('phoneNumber', e.target.value)}
                                        onBlur={() => validate('phoneNumber')}
                                        helperText={validationErrors['phoneNumber']}
                                        error={validationErrors['phoneNumber'] !== undefined}
                                        fullWidth={true}
                                    />

                                </Grid>
                                <Grid item xs={12}>
                                    <Typography className={classes.sectionLabel}>
                                        What
                                    </Typography>
                                    <SelectField
                                        options={convertRoomTypesListToSelectFormat()}
                                        value={booking.roomTypeId}
                                        onChange={(e) => handlePropertyChange('roomTypeId', e)}
                                        onBlur={() => validate('roomTypeId')}
                                        helperText={validationErrors['roomTypeId']}
                                        error={validationErrors['roomTypeId'] !== undefined}
                                        label="Room type"
                                        fullWidth={true}
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

export default withRouter(BookingEdit)
