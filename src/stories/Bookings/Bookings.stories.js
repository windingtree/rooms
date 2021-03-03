import React from 'react';
import fetchMock from 'fetch-mock';
import { MemoryRouter} from 'react-router'

import Bookings from '../../components/Dashboard/Bookings/Bookings';

export default {
    title: 'Bookings/BookingsList',
    component: Bookings
};

const mockApiResponse = [{"id":"603f7da2e4ee6285edbb8105","orderId":"c14b0a3d-7b96-4c8d-a013-ab2eebbaeb34","hotelId":"603e45556c68369b12a512db","checkInDate":"2021-03-03T12:14:24Z","checkOutDate":"2021-03-04T12:14:24Z","guestName":"John Doe","guestEmail":"","phoneNumber":"","roomTypeId":"603e458c5643c89b894c4014"},{"id":"603f7db31454658646d875be","orderId":"97865ff8-0f17-4b83-9b8e-1d3cd9982e99","hotelId":"603e45556c68369b12a512db","checkInDate":"2021-03-31T11:14:00Z","checkOutDate":"2021-04-06T11:14:00Z","guestName":"Foo Bar","guestEmail":"test@test.com","phoneNumber":"123123123","roomTypeId":"603f7d0384c81b84ff7597e5"}]

export const ListOfBookings = () => {
    fetchMock.restore();
    fetchMock.mock('path:/api/v1/bookings',mockApiResponse);
    return (
        <MemoryRouter><Bookings/></MemoryRouter>)

}
