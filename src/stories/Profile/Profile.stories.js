import React from 'react';
import fetchMock from 'fetch-mock';
import { MemoryRouter} from 'react-router'

import Profile from '../../components/Dashboard/Profile/Profile';

export default {
    title: 'Profile/Profile',
    component: Profile
};

const mockApiResponse = {"id":"603e458c5643c89b894c4014","hotelId":"603e45556c68369b12a512db","type":"small","description":"222","quantity":1,"price":100,"currency":"USD","devConPrice":0,"amenities":"American breakfast in the restaurant;Safe box, air conditioning, hair dryer, iron and ironing board, laundry services;","imageUrl":"","guestsNumber":1,"childFriendly":true,"petFriendly":true,"beds":[1,0]}

export const ProfilePage = () => {
    fetchMock.restore();
    fetchMock.mock('path:/api/v1/hotel/undefined',mockApiResponse);
    return (
        <MemoryRouter>
                    <Profile/>
        </MemoryRouter>);
}
