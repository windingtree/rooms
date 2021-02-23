import React, {useEffect, useState} from 'react'

import {useHistory, useParams} from "react-router-dom";
import {apiClient} from "../../../utils/api";
import {errorLogger} from "../../../utils/functions";
import Spinner from "../../base/Spinner/Spinner";
import {RateModifierEditForm} from "./RateEditForm";
import Grid from "@material-ui/core/Grid";

const RateModifierEdit = () =>
{
    const [isLoadInProgress, setLoadInProgress] = useState(false)
    const [rateModifier, setRateModifier] = useState()
    const [roomTypes, setRoomTypes] = useState()
    const { rateModifierId } = useParams();
    const history = useHistory();
    useEffect(()=>{
        loadAvailableRoomTypes();
        fetchRecord(rateModifierId)
    },[rateModifierId])

    function handleSaveRateModifier(record){
        setLoadInProgress(true)
        delete record.id
        apiClient
            .updateRateModifier(rateModifierId,record)
            .then(()=>{
                history.push(`/dashboard/rates`)
            })
            .catch(err=>{
                errorLogger(err)
            })
            .finally(()=>{
                setLoadInProgress(false)
            })
    }
    function handleDeleteRateModifier(){
        setLoadInProgress(true)
        apiClient
            .deleteRateModifier(rateModifierId)
            .then(()=>{
                history.push(`/dashboard/rates`)
            })
            .catch(err=>{
                errorLogger(err)
            })
            .finally(()=>{
                setLoadInProgress(false)
            })
    }

    function fetchRecord(id) {
        setLoadInProgress(true);
        apiClient.getRateModifier(id)
            .then(rateModifier => {
                setRateModifier(rateModifier)
            })
            .catch(error => {
                console.error('Failed to fetch rate modifier:', error)
                errorLogger(error)
            })
            .finally(() => {
                setLoadInProgress(false);
            })
    }

    function loadAvailableRoomTypes() {
        apiClient.getRoomTypes()
            .then(roomTypes => {
                setRoomTypes(roomTypes)
            })
            .catch(error => {
                console.error('Failed to fetch room types:', error)
                errorLogger(error)
            })
            .finally(() => {
            })
    }
    return (
        <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            style={{ minHeight: '100%' }}
        >
            {isLoadInProgress && <Spinner info="loading" />}
            {rateModifier && <RateModifierEditForm rateModifier={rateModifier} availableRooms={roomTypes} handleDelete={handleDeleteRateModifier} handleSave={handleSaveRateModifier}/>}
        </Grid>

    )

}




export default RateModifierEdit
