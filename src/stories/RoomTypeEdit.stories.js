import React from 'react';
import fetchMock from 'fetch-mock';
import { MemoryRouter, Route} from 'react-router'

import RoomTypeEdit from '../components/Dashboard/RoomTypeEdit/RoomTypeEdit';

export default {
    title: 'RoomTypes/RoomTypeEdit',
    component: RoomTypeEdit
};

const mockRoomTypeResponse = {"id":"603e458c5643c89b894c4014","hotelId":"603e45556c68369b12a512db","type":"small","description":"222","quantity":1,"price":100,"currency":"USD","devConPrice":0,"amenities":"American breakfast in the restaurant;Safe box, air conditioning, hair dryer, iron and ironing board, laundry services;","imageUrl":"","guestsNumber":1,"childFriendly":true,"petFriendly":true,"beds":[1,0]}

export const SampleForm = () => {
    fetchMock.restore();
    fetchMock.mock('path:/api/v1/room_type/603e458c5643c89b894c4014',mockRoomTypeResponse);
    return (
        <MemoryRouter initialEntries={['/api/v1/room_type/603e458c5643c89b894c4014']}>
                <Route path='/api/v1/room_type/:roomTypeId'>
                    <RoomTypeEdit/>
                </Route>
        </MemoryRouter>);
}
