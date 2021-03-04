import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import Grid from '@material-ui/core/Grid'

import {errorLogger} from '../../../utils/functions'
import {apiClient} from '../../../utils/api'
import {ApiCache} from '../../../utils/api_cache'
import Spinner from '../../base/Spinner/Spinner'
import {BookingListItem} from "./BookingList/BookingListItem";


import {roomsStyles} from "../../../utils/themes/index"
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
    bookingList: {
        width: roomsStyles.forms.width
    }
})


const apiCache = ApiCache.getInstance()
const Bookings = () => {
    const classes = useStyles();

    const [bookings, setBookings] = useState([]);
    const [apiLoading, setApiLoading] = useState(true);
    const history = useHistory();

    const handleEditClick = (id) => {
        history.push(`/dashboard/bookings/${id}`)
    }


    useEffect(() => {
        setBookings(apiCache.getBookings())
        setApiLoading(true)
        apiClient
            .getBookings()
            .then((bookings) => {
                setBookings(bookings);
                setApiLoading(false);
            })
            .catch((error) => {
                errorLogger(error)
            })
    }, [])

    const getBookingsList = () => {
        return bookings.map((booking) => (
            <BookingListItem key={booking.id} booking={booking} roomTypes={[]} />
        ))
    }
    return (
        <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
        >
            {
                ((!bookings || !bookings.length) && (apiLoading)) ? <Spinner info="loading"/> :
                    <Grid
                        container
                        direction="column"
                        alignItems="center"
                        className={classes.bookingList}
                    >
                        {getBookingsList()}
                        <Grid item>
                            <Button
                                aria-label="edit"
                                onClick={() => handleEditClick('temporary')}
                                variant='contained'
                            >
                                + Add Reservation
                            </Button>
                        </Grid>
                    </Grid>

            }
        </Grid>
    )
}

export default Bookings;
