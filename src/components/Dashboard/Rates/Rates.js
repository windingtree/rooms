import React, {useEffect, useState} from 'react'
import {useHistory} from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Spinner from "../../base/Spinner/Spinner";
import {apiClient} from "../../../utils/api";
import {errorLogger, objClone} from "../../../utils/functions";
import {makeStyles} from '@material-ui/core/styles';
import {Box, CardActionArea, Link, Paper, Switch} from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import {TYPE_PERCENTAGE} from "../../../utils/api/rateModifiers";
import {ApiCache} from "../../../utils/api_cache";
import { withStyles } from '@material-ui/core/styles'


const useStyles = () => {
    return {
        typography:{
            h3:{
                fontSize: '3.2rem'
            }
        }
    }
}


const createRatesStyles = makeStyles({
    add_new_href: {
        color: '#9226AD'
    },
});

const Rates = ({userProfile}) => {
    const history = useHistory();

    const [rateModifiers, setRateModifiers] = useState([])
    const [roomTypes, setRoomTypes] = useState([])
    const [loadInProgress, setLoadInProgress] = useState(false)
    const classes = createRatesStyles();
    const apiCache = ApiCache.getInstance()

    /**
     * Load rate modifiers from the backend and store them in a local state.
     */

    useEffect(() => {
        setLoadInProgress(true);
        //populate data from cache to speed up page loading
        const cachedRateModifiers = apiCache.getRateModifiers();
        sortRateModifiersByPriority(cachedRateModifiers)
        setRateModifiers(cachedRateModifiers)

        setRoomTypes(apiCache.getRoomTypes())

        //load data from the server
        let fetchRatesPromise = apiClient.getRateModifiers().then(rateModifiers => {
            sortRateModifiersByPriority(rateModifiers);
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

    function sortRateModifiersByPriority(rateModifiersList){
        rateModifiersList.sort((a,b)=>{
            if(a.priority>b.priority)
                return -1;
            if(a.priority<b.priority)
                return 1;
            return 0
        })

    }

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

export const RateModifiersList = ({rateModifiers, roomTypes, handlePropertyValueChange, handleEditRateModifier}) =>
{
    function getRoomNameById(roomTypeId){
        if(roomTypes){
            let room=roomTypes.find(({id})=>id === roomTypeId)
            if(room)
                return room.type;
        }
        return ''
    }
    const ratesList = rateModifiers && rateModifiers.map((rateModifier) => {
        let rateModifierRoomIds = rateModifier.id;
        let rateModifierRoomNames = [];
        if (rateModifierRoomIds && Array.isArray(rateModifierRoomIds)) {
            rateModifierRoomNames = rateModifierRoomIds.map(roomId => {
                return getRoomNameById(roomId)
            })
        }
        return (<RateModifierListItem
            key={rateModifier.id}
            id={rateModifier.id}
            type={rateModifier.type}
            enabled={rateModifier.enabled}
            roomTypeNames={rateModifierRoomNames}
            priceModifierAmount={rateModifier.priceModifierAmount}
            priceModifierType={rateModifier.priceModifierType}
            handlePropertyValueChange={handlePropertyValueChange}
            handleEditRateModifier={handleEditRateModifier}/>)
    })


    return (
        <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
        >
                {ratesList}
        </Grid>

    )
}

const createRateStyles = makeStyles({
    rate_card: {
        width: '26em',
        marginTop: '1em',
        marginBottom: '1em',
    },
        rate_name: {
            fontSize: '1.5em',
        },
        negative: {
            color: '#ff0000'
        },
        positive: {
            color: '#00ff00'
        }
    }
);


export const RateModifierListItem = ({id,type,enabled,priceModifierType,priceModifierAmount, roomTypeNames, handlePropertyValueChange, handleEditRateModifier}) =>
{
    const classes = createRateStyles();
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
        amountStr = `${amount} ${typeStr}`
        return (<span className={className}>{amountStr}</span>)
    }

    return (
        <Paper className={classes.rate_card}>
            <CardActionArea >
                <Grid container >
                    <Grid item xs={8} onClick={handleEditClick}>
                        <Box pl={2} pt={1} className={classes.rate_name}>{type} {formatDiscount()}</Box>
                    </Grid>
                    <Grid item xs={4}>
                        <Switch
                            checked={enabled}
                            onChange={handleEnabledChange}
                            name="enabled"
                            inputProps={{'aria-label': 'secondary checkbox'}}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Box pl={2} pb={1}>
                            {roomTypeNames && roomTypeNames.join(',')}
                        </Box>
                    </Grid>
                </Grid>
            </CardActionArea>
        </Paper>
    )
}


export default withStyles(useStyles)(Rates)