import React from 'react';
import fetchMock from 'fetch-mock';
import { MemoryRouter, Route} from 'react-router'

import RoomTypeEdit from '../../components/Dashboard/RoomTypeEdit/RoomTypeEdit';

export default {
    title: 'RoomTypes/RoomTypeEdit',
    component: RoomTypeEdit
};

const response = {
    "id": "603faf785f10ccc4a3c670f5",
    "hotelId": "603e45556c68369b12a512db",
    "type": "test",
    "description": "test",
    "quantity": 2,
    "price": 122,
    "currency": "USD",
    "devConPrice": 0,
    "amenities": "Spinning Center Gym (Basement Floor) except Spa and Hair Salon Services;Safe box, air conditioning, hair dryer, iron and ironing board, laundry services;",
    "imageUrl": "",
    "guestsNumber": 2,
    "childFriendly": true,
    "petFriendly": false,
    "beds": [0, 1],
    "images" : [
        "https://local-rooms-images.s3.us-west-2.amazonaws.com/f4dc4b6f-781e-4f26-aa9e-aa692f43258f"
    ]
}

export const SampleForm = () => {
    fetchMock.restore();
    fetchMock.mock('path:/api/v1/room_type/603e458c5643c89b894c4014',response);
    return (
        <MemoryRouter initialEntries={['/api/v1/room_type/603e458c5643c89b894c4014']}>
                <Route path='/api/v1/room_type/:roomTypeId'>
                    <RoomTypeEdit/>
                </Route>
        </MemoryRouter>);
}
