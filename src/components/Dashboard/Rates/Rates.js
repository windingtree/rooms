import React, {useEffect, useState} from 'react'
import {useHistory} from "react-router-dom";
import Spinner from "../../base/Spinner/Spinner";
import {apiClient} from "../../../utils/api";
import {errorLogger, objClone} from "../../../utils/functions";
import {ApiCache} from "../../../utils/api_cache";
import RateModifiersList from "./RatesList";
import {PageContentWrapper} from "../../base/Common/PageContentWrapper";
import Button from "@material-ui/core/Button";

const apiCache = ApiCache.getInstance()

const Rates = ({userProfile}) => {
    const history = useHistory();
    const [rateModifiers, setRateModifiers] = useState([])
    const [roomTypes, setRoomTypes] = useState([])
    const [loadInProgress, setLoadInProgress] = useState(false)

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

    }, [])

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
        apiCache.updateRateModifier(id,data)
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


    const isDataEmpty = () => (!rateModifiers || !rateModifiers.length)
    const isLoadingInProgress = () => (isDataEmpty() && loadInProgress)

    const welcomeMessage = () => {
        return (
            <>
                <p>When someone books a Room in your hotel, the reservation appears here</p>
                <p>In the meanwhile, try adding a manual reservation, because they are also kept here</p>
            </>
        )
    }

    //order changed - save record
    const rateModifierChanged = (record) => {
        let data = objClone(record);
        delete data.id
        updateRecord(record.id, data)
    }

    return (

    <PageContentWrapper title={"Rate Modifiers"}>
        {isLoadingInProgress() && <Spinner info="loading"/>}
        {isDataEmpty() && !isLoadingInProgress() && welcomeMessage()}
        {rateModifiers && rateModifiers.length > 0 &&
        <RateModifiersList rateModifiers={rateModifiers} roomTypes={roomTypes} key={Math.random()}
                           rateModifierChanged={rateModifierChanged}
                           handleEditRateModifier={handleEditRateModifier}/>
        }
        <Button
            aria-label="edit"
            onClick={() => handleAddRateModifier()}
            variant='contained'
            color='primary'
        >
            + Add rate modifier
        </Button>
    </PageContentWrapper>
    )
}




export default Rates