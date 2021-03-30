import React from 'react'
import makeStyles from "@material-ui/core/styles/makeStyles";
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import CardContent from '@material-ui/core/CardContent'
import * as moment from 'moment'
import {roomsTheme} from "../../../utils/themes"
import {useHistory} from "react-router-dom";

const useStyles = makeStyles( {
        card:{
            marginBottom:'10px',
            width:'100%',
            cursor:'pointer'
        },
        guest_name:{
            fontWeight:roomsTheme.typography.fontWeightBold,
            paddingBottom:'8px'
        },
        room_name:{
        },
        stay_dates:{
        },
        booking_price:{
            color:roomsTheme.palette.secondary.main,
            fontWeight:roomsTheme.typography.fontWeightBold,
        },
        booking_type:{
            paddingTop:'8px',
            color:roomsTheme.palette.secondary.main
        },
        number_of_guests: {
            paddingTop:'2px',
            color:roomsTheme.palette.secondary.main,
            fontWeight:roomsTheme.typography.fontWeightBold,
        }
})

export const BookingListItem = ({booking, roomTypes}) => {
    const {checkInDate, checkOutDate, guestName, roomTypeId, price, currency, numberOfGuests} = booking;
    const classes = useStyles();
    const history = useHistory();
    const getRoomName =()=> {
        if(!roomTypes || !Array.isArray(roomTypes))
            return '';

        let room = roomTypes.find(({id})=>id === roomTypeId)
        if(!room)
            return '';
        return room.type;
    }

    const formatStayDate = () =>{
        let checkIn = moment(checkInDate);
        let checkOut = moment(checkOutDate);

        return `${checkIn.format("D MMM")}-${checkOut.format("D MMM YYYY")}`;
    }
    const handleClick = () => {
        history.push(`/dashboard/bookings/${booking.id}`)
    }
    return (
        <Card className={classes.card}
              onClick={handleClick}>
            <CardContent>
                <Grid
                    container
                    justify="center"
                >
                    <Grid item xs={9} className={classes.guest_name}>
                        {guestName}
                    </Grid>
                    <Grid item xs={3} className={classes.booking_price} style={{textAlign:'right'}}>
                        {price}{currency}
                    </Grid>
                    <Grid item xs={12} className={classes.room_name}>
                        {getRoomName()}
                    </Grid>
                    <Grid item xs={12} className={classes.stay_dates}>
                        {formatStayDate()}
                    </Grid>
                    <Grid item xs={12} className={classes.booking_type}>
                        Prepaid
                    </Grid>
                    <Grid item xs={12} className={classes.number_of_guests} style={{textAlign:'right'}}>
                        {numberOfGuests} guests
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

