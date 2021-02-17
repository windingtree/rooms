import React from 'react';

import { RateModifierEditForm } from '../components/Dashboard/RateEdit/RateEditForm';
import {
    action
} from '@storybook/addon-actions';

export default {
    title: 'Rates/RateModifierEditForm',
    component: RateModifierEditForm
};

const availableRoomTypes = [
    {"id":"602a66b95dbf311d6481f7ac","type":"Single"},
    {"id":"602a66d512617e1e05b6cafe","type":"Double"}]

const sampleRateModifierRecord = {
    id:'123123123',
    type:'Sample rate',
    description:'Sample rate description',
    rooms:["602a66b95dbf311d6481f7ac"]
}

export const SampleForm = () => (<RateModifierEditForm rateModifier={sampleRateModifierRecord} availableRooms={availableRoomTypes} handleSave={action('handleSave called')} handleDelete={action('handleDelete called')}/>);
