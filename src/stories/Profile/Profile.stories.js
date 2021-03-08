import React from 'react';
import fetchMock from 'fetch-mock';
import { MemoryRouter} from 'react-router'

import Profile from '../../components/Dashboard/Profile/Profile';

export default {
    title: 'Profile/Profile',
    component: Profile
};

const dummyProfile = {"id":"6045fe5efc63cbd73285db84","email":"test@test.com","name":"","phone":"","oneTimePassword":"4a5c4cd8-d1a4-4145-a3b6-d3b8d762ea91","sessionToken":"72c5cf97-ad02-47ec-b850-c1b7e3b150bc","role":"OWNER","hotelId":"6045fe5efc63cbd73285db85"}
const mockApiResponse = {"id":"6045fe5efc63cbd73285db85","ownerId":"6045fe5efc63cbd73285db84","name":"Hotel XYZ","description":"Dummy description","address":"address","location":{"lat":0,"lng":0},"imageUrl":"http://blahblahblah.com/blah.jpg","email":"test@test.com"}

export const ProfilePage = () => {
    fetchMock.restore();
    fetchMock.mock('path:/api/v1/hotel/6045fe5efc63cbd73285db85',mockApiResponse);
    return (
        <MemoryRouter>
            <Profile userProfile={dummyProfile}/>
        </MemoryRouter>);
}
