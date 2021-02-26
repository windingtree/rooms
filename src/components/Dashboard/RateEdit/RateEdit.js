import React, {useEffect, useState} from 'react'

import {useHistory, useParams} from "react-router-dom";
import {apiClient} from "../../../utils/api";
import {errorLogger} from "../../../utils/functions";
import Spinner from "../../base/Spinner/Spinner";
import {RateModifierEditForm} from "./RateEditForm";
import Grid from "@material-ui/core/Grid";
import {ApiCache} from "../../../utils/api_cache";

const RateModifierEdit = () => {
    const [isLoadInProgress, setLoadInProgress] = useState(false)
    const [rateModifier, setRateModifier] = useState()
    const [roomTypes, setRoomTypes] = useState()
    const {rateModifierId} = useParams();
    const history = useHistory();
    const apiCache = ApiCache.getInstance()
    useEffect(() => {

        //first load room types from cache
        setRoomTypes(apiCache.getRoomTypes());
        //then load it from server
        let fetchingPromises = [
            apiClient.getRoomTypes().then(roomTypes => {
                setRoomTypes(roomTypes)
            }),
        ]
        if (rateModifierId === 'temporary') {
            //if it's 'temporary' record (newly created, without copy in DB or cache) - skip loading from cache, just prepare new record
            let profile = apiCache.getProfile()
            setRateModifier({id: 'temporary', hotelId: profile.hotelId})
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
                console.error('Failed to fetch rate data:', error)
                errorLogger(error)
            })
            .finally(() => {
                // setLoadInProgress(false);
            })
    }, [rateModifierId, apiCache])

    function handleSaveRateModifier(record) {
        setLoadInProgress(true)
        apiCache.updateRateModifier(rateModifierId, record)
        delete record.id;
        let savePromise
        if (rateModifierId === 'temporary') {
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
            })
            .finally(() => {
                setLoadInProgress(false)
            })

    }

    function handleDeleteRateModifier() {
        //delete record from cache and server
        apiCache.deleteRateModifier(rateModifierId);
        apiClient.deleteRateModifier(rateModifierId)
            .catch(error=>{
                errorLogger(error)
            });
        //don't wait for server response - redirect to list
        history.push(`/dashboard/rates`);
    }

    return (
        <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            style={{minHeight: '100%'}}
        >
            {isLoadInProgress && <Spinner info="loading"/>}
            {rateModifier && <RateModifierEditForm rateModifier={rateModifier} availableRooms={roomTypes}
                                                   handleDelete={handleDeleteRateModifier}
                                                   handleSave={handleSaveRateModifier}/>}
        </Grid>

    )

}


export default RateModifierEdit
