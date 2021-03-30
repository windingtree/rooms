import React from 'react';
import fetchMock from 'fetch-mock';
import { MemoryRouter} from 'react-router'

import RoomTypes from '../../components/Dashboard/RoomTypes/RoomTypes';

export default {
    title: 'RoomTypes/RoomTypes',
    component: RoomTypes
};

const mockApiResponse = [{
    "id": "603e458c5643c89b894c4014",
    "hotelId": "603e45556c68369b12a512db",
    "type": "Small room",
    "description": "222",
    "quantity": 1,
    "price": 100,
    "currency": "USD",
    "devConPrice": 0,
    "amenities": "American breakfast in the restaurant;Safe box, air conditioning, hair dryer, iron and ironing board, laundry services;",
    "images" : [
        "https://local-rooms-images.s3.us-west-2.amazonaws.com/f4dc4b6f-781e-4f26-aa9e-aa692f43258f"
    ],
    "guestsNumber": 1,
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
    "guestsNumber": 2,
    "childFriendly": false,
    "petFriendly": false,
    "beds": [1]
}]

export const ListOfRoomTypes = () => {
    fetchMock.restore();
    fetchMock.mock('path:/api/v1/room_types',mockApiResponse);
    return (
        <MemoryRouter><RoomTypes/></MemoryRouter>)

}
