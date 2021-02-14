import React, {useEffect, useState} from 'react'
import {useHistory} from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Spinner from "../../base/Spinner/Spinner";
import {apiClient} from "../../../utils/api";
import {errorLogger, objClone} from "../../../utils/functions";
import {makeStyles} from '@material-ui/core/styles';
import {CardActionArea, Link, Switch} from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";


const createRatesStyles = makeStyles({
    add_new_href: {
        color: '#9226AD'
    },
});


const Rates = ({userProfile}) => {
    const history = useHistory();

    const [rateModifiers, setRateModifiers] = useState([])
    const [loadInProgress, setLoadInProgress] = useState(false)
    const classes = createRatesStyles();
    useEffect(() => {
        console.log('useEffect')
        fetchRecords();
    }, [])

    /**
     * Load rate modifiers from the backend and store them in a local state.
     */
    function fetchRecords() {
        setLoadInProgress(true);
        apiClient.getRateModifiers()
            .then(rateModifiers => {
                setRateModifiers(rateModifiers)
            })
            .catch(error => {
                console.error('Failed to fetch rates:', error)
                errorLogger(error)
            })
            .finally(() => {
                setLoadInProgress(false);
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
     * Create new rate modifier in the backend and update local store
     */
    function createRecord() {
        const newRecord = {
            hotelId: userProfile.hotelId
        }
        setRateModifiers(rateModifiers.concat(newRecord))
        apiClient.createRateModifier(objClone(newRecord))
            .then((createdRecord) => {
                console.log('Newly created record:', newRecord)
                let records = rateModifiers.map((record) => {
                    if (record.id === createdRecord.id) {
                        return createdRecord
                    } else {
                        return record
                    }
                })
                console.log('Rate modifiers with new record', records)
                setRateModifiers(records)
            })
            .catch((error) => {
                console.error(error)
                errorLogger(error)
            })
    }

    function handleAddRateModifier() {
        createRecord();
    }

    function handleEditRateModifier(id) {
        history.push(`/dashboard/rate/${id}`)
    }

    function handlePropertyValueChange(id, propertyName, propertyValue) {
        console.log('Will update rate modifier, id:', id, ', property:', propertyName, ' new value:', propertyValue)
        const recordToUpdate = rateModifiers.find((record) => {
            return record.id === id;
        })
        console.log('Record to update(BEFORE):', recordToUpdate)
        if (recordToUpdate[propertyName] === propertyValue) {
            return
        }
        const data = {}
        data[propertyName] = propertyValue
        console.log('Record to update(AFTER):', data)
        updateRecord(id, data)
    }

    console.log('Will render rates', rateModifiers)
    return (
        <>
            <h1>Rates</h1>
            {loadInProgress && <Spinner info="loading"/>}
            {rateModifiers && rateModifiers.length > 0 &&
                <RateModifiersList rateModifiers={rateModifiers}
                   handlePropertyValueChange={handlePropertyValueChange}
                   handleEditRateModifier={handleEditRateModifier}/>
            }
            {(!rateModifiers || rateModifiers.length === 0) &&
            <div>
                You have not created any rate modifiers yet
                <p>Let’s create your first one</p>
            </div>
            }
            {
                <>
                    <Link href="#" onClick={handleAddRateModifier} className={classes.add_new_href}><AddCircleIcon/>Add
                        rate modifier</Link>
                </>}
        </>
    )
}

const createListStyles = makeStyles({
    rate_item: {
        minWidth: 500,
    }
});


const RateModifiersList = ({rateModifiers,handlePropertyValueChange,handleEditRateModifier}) =>
{
    const classes = createListStyles();

    const ratesList = rateModifiers && rateModifiers.map((rateModifier) => (
        <RateModifierListItem
            key={rateModifier.id}
            id={rateModifier.id}
            name={rateModifier.type}
            enabled={rateModifier.enabled}
            handlePropertyValueChange={handlePropertyValueChange}
            handleEditRateModifier={handleEditRateModifier}/>
    ))


    return (
        <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
        >
            <div className={classes.rate_item}>
                {ratesList}
            </div>
        </Grid>

    )
}

const createRateStyles = makeStyles({
    rate_name: {
        fontSize: '0.75em',
    }}
);


const RateModifierListItem = ({id,type,enabled, handlePropertyValueChange,handleEditRateModifier}) =>
{
    const classes = createRateStyles();
    //deconstruct rate modifier properties
    const handleEnabledChange = (e) => {
        e.preventDefault();
        console.log('Enabled change, id:',id,'isEnabled:',enabled)
        handlePropertyValueChange(id, 'enabled', !enabled)
    }
    const handleEditClick = () => {
        console.log('Edit change, id:',id,'isEnabled:',enabled)
        handleEditRateModifier(id)
    }

    return (
        <Card>
            <CardActionArea onClick={handleEditClick}>
                <div className={classes.rate_name}>{id},{type}</div>
                <Switch
                    checked={enabled}
                    onChange={handleEnabledChange}
                    name="enabled"
                    inputProps={{'aria-label': 'secondary checkbox'}}
                />
            </CardActionArea>
        </Card>
    )
}


export default Rates
