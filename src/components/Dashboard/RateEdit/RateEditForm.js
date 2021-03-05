import React, {useEffect, useState} from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import CardActions from "@material-ui/core/CardActions";
import {
    Button,
    Checkbox,
    createMuiTheme,
    FormControlLabel,
    MenuItem,
    TextField
} from "@material-ui/core";

import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'
import {datePickerThemeObj} from "../../../utils/themes";
import {ThemeProvider} from "@material-ui/core/styles";
import * as moment from "moment";
import {TYPE_PERCENTAGE, TYPE_ABSOLUTE} from "../../../utils/api/rateModifiers";
import {
    CRITERIA_TYPE_DAYOFWEEK,
    CRITERIA_TYPE_LENGTH_OF_STAY,
    CRITERIA_TYPE_DATERANGE,
} from "../../../utils/api/rateModifiers";
import MultiAutocomplete from "../../base/MultiAutocomplete/MultiAutocomplete";
import makeStyles from "@material-ui/core/styles/makeStyles";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import {PageContentWrapper} from "../../base/Common/PageContentWrapper";
import Typography from "@material-ui/core/Typography";
import {useHistory, useParams} from "react-router-dom";
import {apiClient} from "../../../utils/api";
import {errorLogger, objClone} from "../../../utils/functions";
import {ApiCache} from "../../../utils/api_cache";
import Spinner from "../../base/Spinner/Spinner";
import {isEmpty, isValidFloatNumber} from "../../../utils/validationUtils";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";


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
    }
});
const apiCache = ApiCache.getInstance()

const initializeNewRecord = (userProfile) => {
    return {
        id: 'temporary',
        type: '',
        priceModifierAmount:0,
        priceModifierType:TYPE_PERCENTAGE,
        hotelId: userProfile.hotelId,
        priority: getNewPriority(),
        criteriaType: CRITERIA_TYPE_DATERANGE,
        condition: {},
        rooms: []
    }
}
const getNewPriority = () => {
    let lowestPriority = 10;
    apiCache.getRateModifiers().forEach(record => {
        let priority = parseInt(record.priority);
        if (priority < lowestPriority)
            lowestPriority = priority;
    })
    return lowestPriority - 1;
}


export const RateModifierEditForm = ({userProfile}) => {
    const [isLoadInProgress, setLoadInProgress] = useState(false)
    const [rateModifier, setRateModifier] = useState()
    const [availableRooms, setAvailableRooms] = useState()
    const {rateModifierId} = useParams();
    const history = useHistory();
    const [validationErrors, setValidationErrors] = useState({})
    const classes = useStyles();
    const editMode = rateModifierId !== 'temporary';
    const [snackWarn, setSnackWarn] = useState();


    useEffect(() => {

        //first load room types from cache
        setAvailableRooms(apiCache.getRoomTypes());
        //then load it from server
        let fetchingPromises = [
            apiClient.getRoomTypes().then(roomTypes => {
                setAvailableRooms(roomTypes)
            }),
        ]
        if (!editMode) {
            //if it's 'temporary' record (newly created, without copy in DB or cache) - skip loading from cache, just prepare new record
            let newRec=initializeNewRecord(userProfile)
            setRateModifier(newRec)
        } else {
            //otherwise, load record from cache
            let record = apiCache.getRateModifier(rateModifierId)
            if (record) {
                setRateModifier(record)
            }
            //...and then from server too
            fetchingPromises.push(apiClient.getRateModifier(rateModifierId).then(rateModifier => {
                setRateModifier(rateModifier)
            }));
        }
        //wait for all requests to complete
        Promise.all(fetchingPromises)
            .catch(error => {
                errorLogger(error)
                .then(message=>setSnackWarn(message));
            })
    }, [rateModifierId, editMode, userProfile])

    function handleSave(record) {
        setLoadInProgress(true)
        apiCache.updateRateModifier(rateModifierId, record)
        delete record.id;
        let savePromise
        if (!editMode) {
            //new record is being created - POST it to server
            savePromise = apiClient.createRateModifier(record);
        } else {
            //existing record is being saved - PATCH it to server
            savePromise = apiClient.updateRateModifier(rateModifierId, record)
        }
        savePromise
            .then(() => {
                history.push(`/dashboard/rates`)
            })
            .catch((error) => {
                errorLogger(error)
                 .then(message=>setSnackWarn(message));
            })
            .finally(() => {
                setLoadInProgress(false)
            })

    }

    function handleDelete() {
        //delete record from cache and server
        apiCache.deleteRateModifier(rateModifierId);
        apiClient.deleteRateModifier(rateModifierId)
            .then(()=>{
                history.push(`/dashboard/rates`);
            })
            .catch(error=>{
                errorLogger(error)
                .then(message=>setSnackWarn(message));
            })
        //don't wait for server response - redirect to list
    }



    const validate = (field, returnErrors = false) => {
        const errors = {}
        let rooms = rateModifier.rooms || []
        let condition = rateModifier.condition || {}
        switch (field) {
            case 'type':
                isEmpty(rateModifier.type) && (errors[field] = 'Required field');
                break;
            case 'priceModifierAmount':
                !isValidFloatNumber(rateModifier.priceModifierAmount) && (errors[field] = 'Valid number is required');
                break;
            case 'criteriaType':
                isEmpty(rateModifier.criteriaType) && (errors[field] = 'Select condition type');
                break;
            case 'rooms':
                (rooms.length === 0) && (errors[field] = 'At least one room must be selected');
                break;
            case 'minStay':
                !isNaN(condition.minStay) && (errors[field] = 'Valid number is required');
                break;
            case 'maxStay':
                !isNaN(condition.maxStay) && (errors[field] = 'Valid number is required');
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
            .keys(rateModifier)
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
        handleSave(rateModifier);
    }
    const handlePropertyChange = (fieldName, value) => {
        const newRecord = objClone(rateModifier)
        newRecord[fieldName] = value;
        setRateModifier(newRecord);
    }

    function handleCriteriaChanged(criteria) {
        handlePropertyChange('condition',criteria)
    }

    function getRoomNameById(roomTypeId){
        let room = availableRooms.find(({id})=>id === roomTypeId)
        if(!room)
            return '';
        return room.type;
    }
    let roomNames = [];
    if(availableRooms){
        roomNames = availableRooms.map(room=>{return {name:room.type, id: room.id}})
    }
    let selectedRooms=[];
    if(rateModifier && rateModifier.rooms){
        selectedRooms = rateModifier.rooms.map((id)=>{return {name:getRoomNameById(id), id: id}})
    }
    const onWarnSnackClose = () => {
        setSnackWarn(false);
    }

    function handleSelectedRoomsChanged(chips) {
        let roomIdList = chips.map(({id})=>id)
        handlePropertyChange('rooms',roomIdList)
        // setRooms(roomIdList)
    }


    if (!rateModifier) {
        return (
            <Spinner info="loading" />
        );
    }
    return (
        <PageContentWrapper formTitle='Rate modifier'>
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
                            <Grid container>
                                <Grid item xs>
                                    <Typography className={classes.formTitle}>
                                        Rate Modifier
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    {editMode &&
                                    <IconButton
                                        className={classes.removeButton}
                                        aria-label="delete"
                                        onClick={handleDelete}
                                    >
                                        <DeleteIcon/>
                                    </IconButton>
                                    }
                                </Grid>
                            </Grid>
                            <TextField
                                value={rateModifier.type}
                                color="secondary"
                                variant="outlined"
                                label="Name"
                                fullWidth
                                autoFocus={true}
                                helperText={validationErrors['type']}
                                error={validationErrors['type']!==undefined}
                                onBlur={()=>validate('type')}
                                onChange={(e) => handlePropertyChange('type',e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={6} sm={6}>
                            <TextField
                                value={rateModifier.priceModifierAmount}
                                variant="outlined"
                                color="secondary"
                                label="Value"
                                helperText={validationErrors['priceModifierAmount']}
                                error={validationErrors['priceModifierAmount']!==undefined}
                                onBlur={()=>validate('priceModifierAmount')}
                                fullWidth
                                onChange={(e) => handlePropertyChange('priceModifierAmount',e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={6} sm={6} >
                            <TextField value={rateModifier.priceModifierType}
                                    color="secondary"
                                    variant="outlined"
                                    label="Units"
                                    fullWidth
                                    select
                                       onBlur={()=>validate('priceModifierType')}
                                    onChange={(e) => handlePropertyChange('priceModifierType',e.target.value)}>
                                <MenuItem value={TYPE_ABSOLUTE}>$</MenuItem>
                                <MenuItem value={TYPE_PERCENTAGE}>%</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography className={classes.sectionLabel}>
                                What triggers the modifier?
                            </Typography>

                            <TextField
                                color="secondary"
                                variant="outlined"
                                label="Choose trigger"
                                fullWidth
                                select
                                value={rateModifier.criteriaType}
                                helperText={validationErrors['criteriaType']}
                                error={validationErrors['criteriaType']!==undefined}
                                onBlur={()=>validate('criteriaType')}
                                onChange={(e) => handlePropertyChange('criteriaType',e.target.value)}>
                                <MenuItem value={CRITERIA_TYPE_DATERANGE}>Date</MenuItem>
                                <MenuItem value={CRITERIA_TYPE_DAYOFWEEK}>Day of week</MenuItem>
                                <MenuItem value={CRITERIA_TYPE_LENGTH_OF_STAY}>Length of stay</MenuItem>
                            </TextField>
                        </Grid>
                        <CriteriaForm criteria={rateModifier.condition} criteriaType={rateModifier.criteriaType}
                                      handleCriteriaChanged={handleCriteriaChanged} handleValidate={validate} validationErrors={validationErrors}/>
                        <Grid item xs={12}>
                            <Typography className={classes.sectionLabel}>
                                Which rooms are affected?
                            </Typography>
                            <MultiAutocomplete
                                options={roomNames}
                                value={selectedRooms}
                                onValueChange={(val)=>{handleSelectedRoomsChanged(val);}}
                                inputLabel="Choose room types"
                                helperText={validationErrors['rooms']}
                                onBlur={()=>validate('rooms')}
                                error={validationErrors['rooms']!==undefined}
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

const datePickerTheme = createMuiTheme(datePickerThemeObj)

export const CriteriaForm = ({criteriaType, criteria, handleCriteriaChanged, validationErrors, handleValidate}) => {

    function handleCriteriaPropertyChange(propName, value) {
        let rec = Object.assign({}, criteria)
        rec[propName] = value;
        handleCriteriaChanged(rec);
    }

    return (
        <>
            {criteriaType === CRITERIA_TYPE_DATERANGE &&
            <DateRangeCondition startDate={criteria.startDate} endDate={criteria.endDate}
                                handleCriteriaPropertyChange={handleCriteriaPropertyChange} validationErrors={validationErrors} handleValidate={handleValidate}/>}
            {criteriaType === CRITERIA_TYPE_LENGTH_OF_STAY &&
            <LengthOfStayCondition minStay={criteria.minStay} maxStay={criteria.maxStay}
                                handleCriteriaPropertyChange={handleCriteriaPropertyChange} validationErrors={validationErrors} handleValidate={handleValidate}/>}
            {criteriaType === CRITERIA_TYPE_DAYOFWEEK &&
            <DayOfWeekCondition criteria={criteria}
                                handleCriteriaPropertyChange={handleCriteriaPropertyChange} validationErrors={validationErrors} handleValidate={handleValidate}/>}
        </>
    )
}

export const DateRangeCondition = ({startDate, endDate, handleCriteriaPropertyChange, validationErrors, handleValidate}) => {
    function setDateProperty(propName, e) {
        let dateStr = null;
        if (e) {
            dateStr = moment(e).format();
        }
        handleCriteriaPropertyChange(propName, dateStr)
    }

    return (
        <>
            <Grid item xs={12} sm={6}>
                <ThemeProvider theme={datePickerTheme}>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <KeyboardDatePicker
                            disableToolbar
                            format="DD/MM/yyyy"
                            margin="normal"
                            color="secondary"
                            variant="inline"
                            label="From"
                            fullWidth
                            inputVariant="outlined"
                            value={startDate}
                            onChange={(e) => setDateProperty('startDate', e)}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </ThemeProvider>
            </Grid>
                <Grid item xs={12} sm={6}>
                <ThemeProvider theme={datePickerTheme}>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <KeyboardDatePicker
                            disableToolbar
                            color="secondary"
                            variant="inline"
                            inputVariant="outlined"
                            fullWidth
                            format="DD/MM/yyyy"
                            margin="normal"
                            label="To"
                            value={endDate}
                            onChange={(e) => setDateProperty('endDate', e)}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </ThemeProvider>
            </Grid>

        </>
    )
}

export const LengthOfStayCondition = ({minStay, maxStay, handleCriteriaPropertyChange, validationErrors, handleValidate}) => {
    function setProperty(propName, value) {
        handleCriteriaPropertyChange(propName, value)
    }

    return (
        <>
            <Grid item xs={12} sm={6}>
                <TextField
                    color="secondary"
                    variant="outlined"
                    fullWidth
                    value={minStay}
                    label="Min"
                    helperText={validationErrors['minStay']}
                    error={validationErrors['minStay']!==undefined}
                    onBlur={handleValidate}
                    onChange={(e) => setProperty('minStay',e.target.value)}
                />
            </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                    color="secondary"
                    variant="outlined"
                    fullWidth
                    value={maxStay}
                    label="Max"
                    helperText={validationErrors['maxStay']}
                    error={validationErrors['maxStay']!==undefined}
                    onBlur={handleValidate}
                    onChange={(e) => setProperty('maxStay',e.target.value)}
                />
            </Grid>
        </>
    )
}

export const DayOfWeekCondition = ({criteria,handleCriteriaPropertyChange, validationErrors, handleValidate}) => {
    const days=[
        {id:'monday', label:'Mon'},
        {id:'tuesday', label:'Tue'},
        {id:'wednesday', label:'Wed'},
        {id:'thursday', label:'Thu'},
        {id:'friday', label:'Fri'},
        {id:'saturday', label:'Sat'},
        {id:'sunday', label:'Sun'},
    ]
    function setProperty(propName, value) {
        handleCriteriaPropertyChange(propName, value)
    }
    return (
        <>
            <Grid item xs={12}>
                {days.map(day=>{
                    return (<FormControlLabel
                        value="top"
                        control={<Checkbox checked={criteria[day.id]===true} onChange={()=>setProperty(day.id,!criteria[day.id])} color="secondary" />}
                        label={day.label}
                        labelPlacement="top"
                        key={day.id}
                    />)
                })}
            </Grid>
        </>
    )
}


export default RateModifierEditForm;