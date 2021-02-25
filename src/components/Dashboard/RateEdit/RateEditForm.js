import React, {useState} from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import SaveIcon from "@material-ui/icons/Save";
import {
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


export const RateModifierEditForm = ({rateModifier, availableRooms=[], handleSave, handleDelete}) => {
    const [type, setType] = useState(rateModifier.type)
    const [enabled] = useState(rateModifier.enabled)
    const [criteria, setCriteria] = useState(rateModifier.condition ? rateModifier.condition : {})
    const [criteriaType, setCriteriaType] = useState(rateModifier.criteriaType ? rateModifier.criteriaType : '')
    const [priceModifierType, setPriceModifierType] = useState(rateModifier.priceModifierType ? rateModifier.priceModifierType : TYPE_PERCENTAGE)
    const [priceModifierAmount, setPriceModifierAmount] = useState(rateModifier.priceModifierAmount ? rateModifier.priceModifierAmount : 0)
    const [rooms, setRooms] = useState(rateModifier.rooms?rateModifier.rooms:[])

    function save() {
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
            <Card>
                <CardContent>
                    <Grid
                        container
                        justify="flex-start"
                        alignItems="stretch"
                        spacing={2}
                    >
                        <Grid item xs={12}>
                            <h3>Rate Modifier</h3>
                            <TextField
                                value={type}
                                color="secondary"
                                variant="outlined"
                                label="Name"
                                fullWidth
                                onChange={(e) => setType(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                value={priceModifierAmount}
                                variant="outlined"
                                color="secondary"
                                label="Value"
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
                                onChange={(e) => setCriteriaType(e.target.value)}>
                                <MenuItem value={CRITERIA_TYPE_DATERANGE}>Date</MenuItem>
                                <MenuItem value={CRITERIA_TYPE_DAYOFWEEK}>Day of week</MenuItem>
                                <MenuItem value={CRITERIA_TYPE_LENGTH_OF_STAY}>Length of stay</MenuItem>
                            </TextField>
                        </Grid>
                        <CriteriaForm criteria={criteria} criteriaType={criteriaType}
                                      handleCriteriaChanged={handleCriteriaChanged}/>
                        <Grid item xs={12}>
                            <h3>Which rooms are affected?</h3>
                            <MultiAutocomplete
                                options={roomNames}
                                value={selectedRooms}
                                onValueChange={handleSelectedRoomsChanged}
                                inputLabel="Choose room types"
                                inputWidth={250}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                    <IconButton aria-label="delete" onClick={handleDelete}>
                        <DeleteIcon/>
                    </IconButton>
                    <IconButton aria-label="Save" onClick={save}>
                        <SaveIcon/>
                    </IconButton>
                </CardActions>
            </Card>
    )
}

const datePickerTheme = createMuiTheme(datePickerThemeObj)

export const CriteriaForm = ({criteriaType, criteria, handleCriteriaChanged}) => {

    function handleCriteriaPropertyChange(propName, value) {
        let rec = Object.assign({}, criteria)
        rec[propName] = value;
        handleCriteriaChanged(rec);
    }

    return (
        <>
            {criteriaType === CRITERIA_TYPE_DATERANGE &&
            <DateRangeCondition startDate={criteria.startDate} endDate={criteria.endDate}
                                handleCriteriaPropertyChange={handleCriteriaPropertyChange}/>}
            {criteriaType === CRITERIA_TYPE_LENGTH_OF_STAY &&
            <LengthOfStayCondition minStay={criteria.minStay} maxStay={criteria.maxStay}
                                handleCriteriaPropertyChange={handleCriteriaPropertyChange}/>}
            {criteriaType === CRITERIA_TYPE_DAYOFWEEK &&
            <DayOfWeekCondition criteria={criteria}
                                handleCriteriaPropertyChange={handleCriteriaPropertyChange}/>}
        </>
    )
}

export const DateRangeCondition = ({startDate, endDate, handleCriteriaPropertyChange}) => {
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

export const LengthOfStayCondition = ({minStay, maxStay, handleCriteriaPropertyChange}) => {
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
                    onChange={(e) => setProperty('maxStay',e.target.value)}
                />
            </Grid>
        </>
    )
}

export const DayOfWeekCondition = ({criteria,handleCriteriaPropertyChange}) => {
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
