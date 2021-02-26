import React, {useState} from "react";
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
import {DARK_PURPLE, WHITE} from "../../../utils/themes/theme_colors";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";



const useStyles = makeStyles({
    saveButton: {
        background: DARK_PURPLE,
        color: WHITE,
        justifyContent: "flex-start",
        margin:'10px'
    },
});


export const RateModifierEditForm = ({rateModifier, availableRooms=[], handleSave, handleDelete}) => {
    const [type, setType] = useState(rateModifier.type)
    const [enabled] = useState(rateModifier.enabled)
    const [criteria, setCriteria] = useState(rateModifier.condition ? rateModifier.condition : {})
    const [criteriaType, setCriteriaType] = useState(rateModifier.criteriaType ? rateModifier.criteriaType : '')
    const [priceModifierType, setPriceModifierType] = useState(rateModifier.priceModifierType ? rateModifier.priceModifierType : TYPE_PERCENTAGE)
    const [priceModifierAmount, setPriceModifierAmount] = useState(rateModifier.priceModifierAmount ? rateModifier.priceModifierAmount : 0)
    const [rooms, setRooms] = useState(rateModifier.rooms?rateModifier.rooms:[])
    const [validationErrors, setValidationErrors] = useState({})
    const classes = useStyles();

    const isNullOrEmpty = (param) => {
        return (param === undefined || param === null || param === '')
    }

    function validate() {
        const errors = {}
        if (isNullOrEmpty(type)) {
            errors['type'] = 'Field is required'
        }
        if (isNullOrEmpty(priceModifierAmount)) {
            errors['priceModifierAmount'] = 'Valid number is required'
        }

        if (isNullOrEmpty(criteriaType)) {
            errors['criteriaType'] = 'Select condition type'
        }
        if (!rooms || rooms.length === 0) {
            errors['rooms'] = 'At least one room must be selected'
        }
        if (criteriaType === CRITERIA_TYPE_LENGTH_OF_STAY) {
            if ((isNullOrEmpty(criteria.minStay) || isNaN(criteria.minStay)) && (isNullOrEmpty(criteria.maxStay) || isNaN(criteria.maxStay))) {
                errors['minStay'] = 'At least on of fields should be provided'
                errors['maxStay'] = 'At least on of fields should be provided'
            }
        }
        setValidationErrors(errors)
        return Object.keys(errors).length === 0;
    }
    function save() {
        if(!validate()){
            console.log('Form is not valid')
            return;
        }
        const record = Object.assign({}, rateModifier);
        record.type = type;
        record.enabled = enabled;
        record.priceModifierType = priceModifierType;
        record.priceModifierAmount = priceModifierAmount;
        record.criteriaType = criteriaType;
        record.condition = criteria;
        record.rooms=rooms;
        handleSave(record);
    }

    function handleCriteriaChanged(criteria) {
        setCriteria(criteria)
    }

    function getRoomNameById(roomTypeId){
        let room = availableRooms.find(({id})=>id === roomTypeId)
        if(!room)
            return '';
        return room.type;
    }
    let roomNames = availableRooms.map(room=>{return {name:room.type, id: room.id}})
    let selectedRooms = rooms.map((id)=>{return {name:getRoomNameById(id), id: id}})

    function handleSelectedRoomsChanged(chips) {
        let roomIdList = chips.map(({id})=>id)
        setRooms(roomIdList)
    }

    return (
        <form noValidate autoComplete="off">
            <Card style={{maxWidth:'600px'}}>
                <CardContent>
                    <Grid
                        container
                        justify="flex-start"
                        alignItems="stretch"
                        spacing={2}
                    >
                        <Grid item xs={12}>
                            <Grid container spacing={0}>
                                <Grid item xs={8}>
                                    <h3>Rate Modifier</h3>
                                </Grid>
                                <Grid item xs={4} style={{textAlign:'right'}}>
                                    <IconButton aria-label="delete" onClick={handleDelete}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </Grid>
                            </Grid>


                            <TextField
                                value={type}
                                color="secondary"
                                variant="outlined"
                                label="Name"
                                fullWidth
                                helperText={validationErrors['type']}
                                error={validationErrors['type']!==undefined}
                                onBlur={validate}
                                onChange={(e) => setType(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                value={priceModifierAmount}
                                variant="outlined"
                                color="secondary"
                                label="Value"
                                helperText={validationErrors['priceModifierAmount']}
                                error={validationErrors['priceModifierAmount']!==undefined}
                                onBlur={validate}
                                fullWidth
                                onChange={(e) => setPriceModifierAmount(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} >
                            <TextField value={priceModifierType}
                                    color="secondary"
                                    variant="outlined"
                                    label="Units"
                                    fullWidth
                                    select
                                    onChange={(e) => setPriceModifierType(e.target.value)}>
                                <MenuItem value={TYPE_ABSOLUTE}>$</MenuItem>
                                <MenuItem value={TYPE_PERCENTAGE}>%</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <h3>What triggers the modifier?</h3>
                            <TextField
                                color="secondary"
                                variant="outlined"
                                label="Choose trigger"
                                fullWidth
                                select
                                value={criteriaType}
                                helperText={validationErrors['criteriaType']}
                                error={validationErrors['criteriaType']!==undefined}
                                onBlur={validate}
                                onChange={(e) => setCriteriaType(e.target.value)}>
                                <MenuItem value={CRITERIA_TYPE_DATERANGE}>Date</MenuItem>
                                <MenuItem value={CRITERIA_TYPE_DAYOFWEEK}>Day of week</MenuItem>
                                <MenuItem value={CRITERIA_TYPE_LENGTH_OF_STAY}>Length of stay</MenuItem>
                            </TextField>
                        </Grid>
                        <CriteriaForm criteria={criteria} criteriaType={criteriaType}
                                      handleCriteriaChanged={handleCriteriaChanged} handleValidate={validate} validationErrors={validationErrors}/>
                        <Grid item xs={12}>
                            <h3>Which rooms are affected?</h3>
                            <MultiAutocomplete
                                options={roomNames}
                                value={selectedRooms}
                                onValueChange={(val)=>{validate();handleSelectedRoomsChanged(val)}}
                                inputLabel="Choose room types"
                                helperText={validationErrors['rooms']}
                                error={validationErrors['rooms']!==undefined}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                    <Button variant="contained" className={classes.saveButton} onClick={save} fullWidth size="large">
                        Save
                    </Button>
                </CardActions>
            </Card>
        </form>
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
