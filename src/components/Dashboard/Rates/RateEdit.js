import React, {useEffect, useState} from 'react'
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextEditInput from "../../base/TextEditInput/TextEditInput";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from "@material-ui/icons/Delete";
// import {makeStyles} from '@material-ui/core/styles';
import {useHistory, useParams} from "react-router-dom";
import {apiClient} from "../../../utils/api";
import {errorLogger} from "../../../utils/functions";
import Spinner from "../../base/Spinner/Spinner";

/*const createRateStyles = makeStyles({
    rate_name: {
        fontSize: '0.75em',
    }}
);*/


const RateModifierEdit = () =>
{
    const [isLoadInProgress, setLoadInProgress] = useState(false)
    const [rateModifier, setRateModifier] = useState()
    const { rateModifierId } = useParams();
    const history = useHistory();
    // const classes = createRateStyles();
    useEffect(()=>{
        fetchRecord(rateModifierId)
    },[rateModifierId])

    function handlePropertyChange(propName, value){
        console.log('Property changed, property:',propName,', value:', value)
        const changedRec = Object.assign({},rateModifier);
        changedRec[propName] = value;
        console.log('Before:', rateModifier, 'After',changedRec)
        setRateModifier(changedRec)
    }

    function handleSaveChanges(){
        console.log('Save changes')
        setLoadInProgress(true)
        const record = Object.assign({},rateModifier)
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
        console.log('Delete ')
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
    //deconstruct rate modifier properties
    // const {id, type,description,enabled} = rateModifier;
    console.log('Edit rate modifier, id:',rateModifierId)

    return (
        <>
        <div>EDIT:{rateModifierId}</div>
        {isLoadInProgress && <Spinner info="loading" />}
            {rateModifier &&
            <Card>
                <CardContent>
                    <Grid
                        container
                        direction="column"
                        justify="center"
                        alignItems="stretch"
                        style={{minHeight: '100%'}}
                    >
                        <Grid item>
                            <TextEditInput
                                value={rateModifier.type}
                                label="Name"
                                onValueChange={(v)=>handlePropertyChange('type',v)}
                                inputWidth={150}
                            />
                        </Grid>
                        <Grid item>
                            <TextEditInput
                                value={rateModifier.description}
                                label="Description"
                                onValueChange={(v)=>handlePropertyChange('description',v)}
                                inputWidth={150}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                    <IconButton aria-label="delete" onClick={handleDeleteRateModifier}>
                        <DeleteIcon/>
                    </IconButton>
                    <IconButton aria-label="Save" onClick={handleSaveChanges}>
                        <SaveIcon/>
                    </IconButton>
                </CardActions>
            </Card>
            }
        </>

    )

}


export default RateModifierEdit
