import React from 'react';

import {BookingListItem} from '../../components/Dashboard/Bookings/BookingListItem';

export default {
    title: 'Bookings/BookingListItem',
    component: BookingListItem
};

let sampleBooking = {
    "id": "603fe67d2f131ff0d45b42af",
    "orderId": "f59f54c8-1550-4165-93bf-83078ec12e8e",
    "hotelId": "603fb077e22411c76f2abff9",
    "checkInDate": "2021-03-03T19:41:47Z",
    "checkOutDate": "2021-03-04T19:41:47Z",
    "guestName": "Anna Doe",
    "guestEmail": "john@doe.com",
    "phoneNumber": "+48 123123123",
    "roomTypeId": "603fe9af51e89ef30c319734"
};

let roomTypes = [{"id":"603fe9af51e89ef30c319734","hotelId":"603fb077e22411c76f2abff9","type":"Single","description":"single","quantity":1,"price":1,"currency":"USD","devConPrice":0,"amenities":"Room with Queen Bed;","imageUrl":"","numberOfGuests":1,"childFriendly":true,"petFriendly":false,"beds":[1],"images":[]},{"id":"603fe9c3122854f339d77069","hotelId":"603fb077e22411c76f2abff9","type":"Double","description":"ddd","quantity":1,"price":1,"currency":"USD","devConPrice":0,"amenities":"Safe box, air conditioning, hair dryer, iron and ironing board, laundry services;","imageUrl":"","numberOfGuests":2,"childFriendly":true,"petFriendly":false,"beds":[1],"images":[]}]

export const BookingItem = () => {
    return (
        <BookingListItem booking={sampleBooking} roomTypes={roomTypes}/>)
}
