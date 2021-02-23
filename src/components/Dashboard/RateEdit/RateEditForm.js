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
    InputLabel,
    ListItemText,
    MenuItem,
    Select,
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



export const RateModifierEditForm = ({rateModifier, availableRooms=[], handleSave, handleDelete}) => {
    const [type, setType] = useState(rateModifier.type)
    const [description, setDescription] = useState(rateModifier.description)
    const [enabled] = useState(rateModifier.enabled)
    const [priority, setPriority] = useState(rateModifier.priority ? rateModifier.priority : 1)
    const [criteria, setCriteria] = useState(rateModifier.condition ? rateModifier.condition : {})
    const [criteriaType, setCriteriaType] = useState(rateModifier.criteriaType ? rateModifier.criteriaType : '')
    const [priceModifierType, setPriceModifierType] = useState(rateModifier.priceModifierType ? rateModifier.priceModifierType : TYPE_PERCENTAGE)
    const [priceModifierAmount, setPriceModifierAmount] = useState(rateModifier.priceModifierAmount ? rateModifier.priceModifierAmount : 0)
    const [rooms, setRooms] = useState(rateModifier.rooms?rateModifier.rooms:[])

    function save() {
        const record = Object.assign({}, rateModifier);
        record.type = type;
        record.description = description;
        record.enabled = enabled;
        record.priority = priority;
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
    return (
            <Card style={{maxWidth: '40em'}}>
                <CardContent>
                    <Grid
                        container
                        justify="flex-start"
                        alignItems="stretch"
                        spacing={2}
                    >
                        <Grid item xs={12}>
                            <TextField
                                value={type}
                                color="secondary"
                                variant="outlined"
                                label="Name"
                                style = {{width: 200}}
                                onChange={(e) => setType(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} >
                            <TextField
                                value={priceModifierAmount}
                                color="secondary"
                                label="Modifier"
                                style = {{width: 100}}
                                onChange={(e) => setPriceModifierAmount(e.target.value)}
                            />
                            <Select value={priceModifierType}
                                    color="secondary"
                                    style = {{height: '3em'}}
                                    onChange={(e) => setPriceModifierType(e.target.value)}>
                                <MenuItem value={TYPE_ABSOLUTE}>$</MenuItem>
                                <MenuItem value={TYPE_PERCENTAGE}>%</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={12}>
                            <InputLabel id="priority-label">Priority</InputLabel>
                            <Select  value={priority}
                                     labelId="priority-label"
                                     color="secondary"
                                     style = {{height: '3em'}}
                                     onChange={(e) => setPriority(e.target.value)}>
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={2}>2</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                                <MenuItem value={4}>4</MenuItem>
                                <MenuItem value={5}>5</MenuItem>
                            </Select>

                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                color="secondary"
                                value={description}
                                multiline
                                rows={3}
                                style = {{width: 200}}
                                label="Modifier"
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <InputLabel id="room-label">Room</InputLabel>
                                <Select
                                    labelId="room-label"
                                    multiple
                                    value={rooms}
                                    color="secondary"
                                    variant="outlined"
                                    label="Room"
                                    style = {{width: 200}}
                                    onChange={(e)=>setRooms(e.target.value)}
                                    renderValue={(selected) => selected.map(roomTypeId=>getRoomNameById(roomTypeId)).join(', ')}
                                >
                                    {availableRooms.map(({id,type}) => (

                                        <MenuItem key={id} value={id}>
                                            <Checkbox checked={rooms.indexOf(id) > -1} />
                                            <ListItemText primary={type} />
                                        </MenuItem>
                                    ))}
                                </Select>
                        </Grid>
                        <Grid item xs={12}>
                            <InputLabel id="condition-label">Choose trigger</InputLabel>
                            <Select
                                color="secondary"
                                variant="outlined"
                                label="Trigger"
                                value={criteriaType}
                                style = {{width: 200}}
                                onChange={(e) => setCriteriaType(e.target.value)}>
                                <MenuItem value={CRITERIA_TYPE_DATERANGE}>Date</MenuItem>
                                <MenuItem value={CRITERIA_TYPE_DAYOFWEEK}>Day of week</MenuItem>
                                <MenuItem value={CRITERIA_TYPE_LENGTH_OF_STAY}>Length of stay</MenuItem>
                            </Select>
                        </Grid>

                        <CriteriaForm criteria={criteria} criteriaType={criteriaType}
                                      handleCriteriaChanged={handleCriteriaChanged}/>
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
            <Grid item xs={12}>
                <ThemeProvider theme={datePickerTheme}>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="DD/MM/yyyy"
                            margin="normal"
                            label="From"
                            value={startDate}
                            onChange={(e) => setDateProperty('startDate', e)}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </ThemeProvider>
                <ThemeProvider theme={datePickerTheme}>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
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
            <Grid item xs={12}>
                <TextField
                    variant="outlined"
                    value={minStay}
                    label="Min"
                    style = {{width: 200}}
                    onChange={(e) => setProperty('minStay',e.target.value)}
                />
                <TextField
                    variant="outlined"
                    value={maxStay}
                    label="Max"
                    style = {{width: 200}}
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
