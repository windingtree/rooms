import React from 'react';
import fetchMock from 'fetch-mock';
import { MemoryRouter, Route} from 'react-router'

import { RateModifierEditForm } from '../../components/Dashboard/RateEdit/RateEditForm';

export default {
    title: 'Rates/RateModifierEditForm',
    component: RateModifierEditForm
};

const mockRoomTypesResponse = [{"id":"604203caa68259a80210c6d0","hotelId":"6042037070ba9aa76c8125b5","type":"Single room","description":"single","quantity":11,"price":123,"currency":"USD","devConPrice":0,"amenities":"5 first minutes in local calls;Room service 24 hours;Safe box, air conditioning, hair dryer, iron and ironing board, laundry services;","imageUrl":"","guestsNumber":1,"childFriendly":true,"petFriendly":true,"beds":[0],"images":[]}]
const mockRateModifierResponse = {"id":"604225332cc500c161616dea","hotelId":"6042037070ba9aa76c8125b5","type":"Holidays","description":"","enabled":true,"priority":9,"criteriaType":"DATE_RANGE","priceModifierType":"percentage","priceModifierAmount":"-20","combinable":false,"condition":{"minStay":"2","maxStay":"4","monday":null,"tuesday":null,"wednesday":true,"thursday":true,"friday":null,"saturday":null,"sunday":null,"startDate":"2021-07-01T13:48:00+02:00","endDate":"2021-08-31T13:48:00+02:00","promoCode":null},"rooms":["604203caa68259a80210c6d0"]}
const sampleProfile = {"id":"6042037070ba9aa76c8125b4","email":"test@test.com","name":"","phone":"","oneTimePassword":"b456e149-6994-4e3e-ad4a-8a16cb92ef3a","sessionToken":"9ff195b6-1ad3-43a2-b5da-741f76b2f156","role":"OWNER","hotelId":"6042037070ba9aa76c8125b5"}


export const SampleForm = () => {
    fetchMock.restore();
    fetchMock.mock('path:/api/v1/rate_modifier/604225332cc500c161616dea',mockRateModifierResponse);
    fetchMock.mock('path:/api/v1/room_types',mockRoomTypesResponse);
    return (
        <MemoryRouter initialEntries={['/dashboard/rates/604225332cc500c161616dea']}>
            <Route path='/dashboard/rates/:rateModifierId'>
                <RateModifierEditForm userProfile={sampleProfile}/>
            </Route>
        </MemoryRouter>);
}
