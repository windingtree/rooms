import React, {useEffect, useState} from 'react'
import {useHistory} from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Spinner from "../../base/Spinner/Spinner";
import {apiClient} from "../../../utils/api";
import {errorLogger, objClone} from "../../../utils/functions";
import {makeStyles} from '@material-ui/core/styles';
import {Link, Paper, Switch, Typography} from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import {TYPE_PERCENTAGE} from "../../../utils/api/rateModifiers";
import {ApiCache} from "../../../utils/api_cache";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DragHandleIcon from '@material-ui/icons/DragHandle';


const useStyles = makeStyles({
    add_new_href: {
        color: '#9226AD'
    },
    grow: {
        flexGrow: 1,
    },
    rate_list: {
        width: '600px',
        margin: '16px',
        maxWidth: '90vw'
    },
    rate_list_item: {
        minWidth: '500px',
        minHeight:'60px',
        marginTop:'10px',
        marginBottom:'10px',
        paddingLeft:'10px'
    },
    rate_edit_card: {
        width: '600px',
        margin: '16px',
        maxWidth: '90vw'
    },
    rateName: {
        fontSize: '1.5em',
    },
    negative: {
        color: '#ff0000'
    },
    positive: {
        color: '#00ff00'
    }
});

const Rates = ({userProfile}) => {
    const history = useHistory();

    const [rateModifiers, setRateModifiers] = useState([])
    const [roomTypes, setRoomTypes] = useState([])
    const [loadInProgress, setLoadInProgress] = useState(false)
    const classes = useStyles();
    const apiCache = ApiCache.getInstance()

    /**
     * Load rate modifiers from the backend and store them in a local state.
     */

    useEffect(() => {
        setLoadInProgress(true);
        //populate data from cache to speed up page loading
        const cachedRateModifiers = apiCache.getRateModifiers();
        setRateModifiers(cachedRateModifiers)
        setRoomTypes(apiCache.getRoomTypes())
        //load data from the server
        let fetchRatesPromise = apiClient.getRateModifiers().then(rateModifiers => {
            setRateModifiers(rateModifiers)});
        let fetchRoomsPromise = apiClient.getRoomTypes().then(roomTypes=>{setRoomTypes(roomTypes)});
        Promise.all([fetchRatesPromise,fetchRoomsPromise])
            .catch(error => {
                console.error('Failed to fetch data from server:', error)
                errorLogger(error)
            })
            .finally(() => {
                setLoadInProgress(false);
            })

    }, [apiCache])

    /**
     * Update rate modifier in the backend and update local store too
     * @param id ID of the record to be updated
     * @param data record itself
     */
    function updateRecord(id, data) {
        const updatedRecords = rateModifiers.map((record) => {
            if (record.id === id) {
                return Object.assign(
                    {},
                    objClone(record),
                    objClone(data)
                )
            } else {
                return record
            }
        })
        setRateModifiers(updatedRecords)
        apiClient.updateRateModifier(id, data)
            .catch((error) => {
                errorLogger(error)
            })
    }

    /**
     * Create new rate modifier record, add that to cache.
     * Note: it does not store it on server as it is not complete - user has to update fields and save it
     */
    function handleAddRateModifier() {
        const newRecord = {
            hotelId: userProfile.hotelId,
            id: 'temporary'
        }
        //add it to cache so that it can be loaded by the edit form
        // apiCache.addRateModifier(newRecord);
        history.push(`/dashboard/rates/${newRecord.id}`)
    }

    function handleEditRateModifier(id) {
        history.push(`/dashboard/rates/${id}`)
    }

    function handlePropertyValueChange(id, propertyName, propertyValue) {
        const recordToUpdate = rateModifiers.find((record) => {
            return record.id === id;
        })
        if (recordToUpdate[propertyName] === propertyValue) {
            return
        }
        const data = {}
        data[propertyName] = propertyValue
        updateRecord(id, data)
    }

    return (
        <>
            <h3>Rate modifiers</h3>
            {loadInProgress && (!rateModifiers || rateModifiers.length === 0) && <Spinner info="loading"/>}
            {rateModifiers && rateModifiers.length > 0 &&
            <RateModifiersList rateModifiers={rateModifiers} roomTypes={roomTypes}
                               handlePropertyValueChange={handlePropertyValueChange}
                               handleEditRateModifier={handleEditRateModifier}/>
            }
            {(!rateModifiers || rateModifiers.length === 0) &&
            <div style={{textAlign:"center"}}>
                Here you can create and apply discounts or price increases to you Unit Types base rates.
                <p>Let’s create your first Rate Modifier</p>
            </div>

            }
            {
                <div style={{textAlign:"center"}}>
                    <Link href="#" onClick={handleAddRateModifier} className={classes.add_new_href}><AddCircleIcon/>Add
                        rate modifier</Link>
                </div>}
        </>
    )
}

export const RateModifierListItem = ({id,type,enabled,priceModifierType,priceModifierAmount, roomTypeNames, handlePropertyValueChange, handleEditRateModifier}) =>
{
    const classes = useStyles();
    //deconstruct rate modifier properties
    const handleEnabledChange = () => {
        handlePropertyValueChange(id, 'enabled', !enabled)
    }
    const handleEditClick = () => {
        handleEditRateModifier(id)
    }

    const formatDiscount = () => {
        const amount = parseFloat(priceModifierAmount)
        let typeStr = '';
        if(priceModifierType ===  TYPE_PERCENTAGE) {
            typeStr = '%';
        }
        let amountStr;
        let className = '';
        if(amount<0) {
            className = classes.negative
        }
        if(amount>0) {
            className = classes.positive
        }
        amountStr = `${amount}${typeStr}`
        return (<span className={className}>{amountStr}</span>)
    }

    return (
<>
            <Grid container
                  direction="row"
                  justify="center"
                  alignItems="center" className={classes.rate_list_item}>
                <Grid item xs={1}>
                    <DragHandleIcon/>
                </Grid>
                <Grid item xs={7} onClick={handleEditClick}>
                    <Grid container
                          direction="row"
                          justify="center"
                          alignItems="center">
                        <Grid item xs={12}>
                            <Typography>{type} {formatDiscount()}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            {roomTypeNames && roomTypeNames.join(',')}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={4} style={{textAlign:'right'}}>
                    <Switch
                        checked={enabled}
                        onChange={handleEnabledChange}
                        name="enabled"
                        inputProps={{'aria-label': 'secondary checkbox'}}
                    />
                </Grid>
            </Grid>
</>
    )
}


const sortRatesByPriority = rateModifiers => {
    if(!Array.isArray(rateModifiers))
        return [];
    rateModifiers.sort((a,b)=>{
        if(a.priority>b.priority)
            return 1;
        if(a.priority<b.priority)
            return -1;
        return 0
    })
    return rateModifiers;
}

const shiftUp = (list, startIndex, endIndex) => {
    if(startIndex<endIndex)
        throw new Error(`StartIndex (${startIndex}) must be higher than EndIndex (${endIndex})`)
    for(let i=endIndex;i<startIndex;i++){
        let tmp = list[i].priority;
        list[i].priority=list[i + 1].priority
        list[i + 1].priority=tmp;
    }
}

const shiftDown = (list, startIndex, endIndex) => {
    if(startIndex>endIndex)
        throw new Error(`StartIndex (${startIndex}) must be lower than EndIndex (${endIndex})`)
    for(let i=endIndex;i>startIndex;i--){
        let tmp = list[i-1].priority;
        list[i-1].priority=list[i].priority
        list[i].priority=tmp;
    }
}

const reorderRateModifiersList = (rateModifiers, startIndex, endIndex) => {
    if(startIndex<endIndex) {
        shiftDown(rateModifiers,startIndex,endIndex)
    }
    else {
        shiftUp(rateModifiers,startIndex,endIndex)
    }
    sortRatesByPriority(rateModifiers)
    return rateModifiers;
}


export const RateModifiersList = ({rateModifiers, roomTypes, handlePropertyValueChange, handleEditRateModifier}) => {
    const [rates, setRates] = useState(sortRatesByPriority(rateModifiers));

    const onDragEnd = (result) =>{
        // dropped outside the list
        if (!result.destination) {
            return;
        }
        const newRates = reorderRateModifiersList(
            rates,
            result.source.index,
            result.destination.index
        );
        setRates(newRates)
    }


    //get room name based on its ID
    function getRoomNameById(roomTypeId){
        if(roomTypes){
            let room=roomTypes.find(({id})=>id === roomTypeId)
            if(room)
                return room.type;
        }
        return ''
    }

    //get all room names that are assigned to a rate modifier
    const getRateModifierRoomNames = (rateModifier) => {
        let rateModifierRoomIds = rateModifier.id;
        let rateModifierRoomNames = [];
        if (rateModifierRoomIds && Array.isArray(rateModifierRoomIds)) {
            rateModifierRoomNames = rateModifierRoomIds.map(roomId => {
                return getRoomNameById(roomId)
            })
        }
        return rateModifierRoomNames;
    }

    //sort rate modifiers by priority before displaying it
    sortRatesByPriority(rateModifiers)

    return (

        <>
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
            >

        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {rates.map((rateModifier, index) => (
                            <Draggable key={rateModifier.id} draggableId={rateModifier.id} index={index}>
                                {(provided, snapshot) => (
                                    <Paper
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <RateModifierListItem
                                            key={rateModifier.id}
                                            id={rateModifier.id}
                                            type={rateModifier.type}
                                            enabled={rateModifier.enabled}
                                            roomTypeNames={getRateModifierRoomNames(rateModifier.id)}
                                            priceModifierAmount={rateModifier.priceModifierAmount}
                                            priceModifierType={rateModifier.priceModifierType}
                                            handlePropertyValueChange={handlePropertyValueChange}
                                            handleEditRateModifier={handleEditRateModifier}/>

                                    </Paper>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>

            </Grid>
        </>

    );
}




export default Rates