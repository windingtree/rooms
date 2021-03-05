import React from 'react'
import Grid from "@material-ui/core/Grid";
import {makeStyles} from '@material-ui/core/styles';
import {Switch, Typography} from "@material-ui/core";
import {TYPE_PERCENTAGE} from "../../../utils/api/rateModifiers";
import DragHandleIcon from '@material-ui/icons/DragHandle';


const useStyles = makeStyles({
    rate_list_item: {
        minHeight: '60px',
        marginTop: '10px',
        marginBottom: '10px',
        paddingLeft: '10px'
    },
    negative: {
        color: '#ff0000'
    },
    positive: {
        color: '#00ff00'
    }
});


export const RateModifierListItem = ({
                                         rateModifier,
                                         roomTypeNames,
                                         onEnableDisableFlagChanged,
                                         handleEditRateModifier
                                     }) => {
    const {id, type, enabled, priceModifierType, priceModifierAmount} = rateModifier;
    const classes = useStyles();
    const handleEnabledChange = () => {
        onEnableDisableFlagChanged(rateModifier, !enabled)
    }
    const handleEditClick = () => {
        handleEditRateModifier(id)
    }

    const formatDiscount = () => {
        const amount = parseFloat(priceModifierAmount)
        let typeStr = '';
        if (priceModifierType === TYPE_PERCENTAGE) {
            typeStr = '%';
        }
        let amountStr;
        let className = '';
        if (amount < 0) {
            className = classes.negative
        }
        if (amount > 0) {
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
                <Grid item xs={4} style={{textAlign: 'right'}}>
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


export default RateModifierListItem