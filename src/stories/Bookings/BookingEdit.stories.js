import React from 'react';
import fetchMock from 'fetch-mock';
import { MemoryRouter, Route} from 'react-router'

import BookingTypeEdit from '../../components/Dashboard/BookingTypeEdit/BookingTypeEdit';

export default {
    title: 'Bookings/BookingTypeEdit',
    component: BookingTypeEdit
};

const mockRoomTypesResponse = [{
    "id": "603e458c5643c89b894c4014",
    "hotelId": "603e45556c68369b12a512db",
    "type": "Small room",
    "description": "222",
    "quantity": 1,
    "price": 100,
    "currency": "USD",
    "devConPrice": 0,
    "amenities": "American breakfast in the restaurant;Safe box, air conditioning, hair dryer, iron and ironing board, laundry services;",
    "imageUrl": "",
    "numberOfGuests": 1,
    "childFriendly": true,
    "petFriendly": true,
    "beds": [1, 0]
}, {
    "id": "603f7d0384c81b84ff7597e5",
    "hotelId": "603e45556c68369b12a512db",
    "type": "Double room",
    "description": "some description",
    "quantity": 2,
    "price": 123,
    "currency": "USD",
    "devConPrice": 0,
    "amenities": "Room service 24 hours;American breakfast in the restaurant;",
    "imageUrl": "",
    "numberOfGuests": 2,
    "childFriendly": false,
    "petFriendly": false,
    "beds": [1]
}]
const mockBoookingResponse = {
    "id": "603f7da2e4ee6285edbb8105",
    "orderId": "c14b0a3d-7b96-4c8d-a013-ab2eebbaeb34",
    "hotelId": "603e45556c68369b12a512db",
    "checkInDate": "2021-03-03T12:14:24Z",
    "checkOutDate": "2021-03-04T12:14:24Z",
    "guestName": "John Doe",
    "guestEmail": "",
    "phoneNumber": "",
    "roomTypeId": "603e458c5643c89b894c4014"
}

export const SampleForm = () => {
    fetchMock.restore();
    fetchMock.mock('path:/api/v1/booking/603f7da2e4ee6285edbb8105',mockBoookingResponse);
    fetchMock.mock('path:/api/v1/room_types',mockRoomTypesResponse);
    return (
        <MemoryRouter initialEntries={['/dashboard/bookings/603f7da2e4ee6285edbb8105']}>
                <Route path='/dashboard/bookings/:bookingId'>
                    <BookingTypeEdit/>
                </Route>
        </MemoryRouter>);
}
