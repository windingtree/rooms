import React from 'react';

import {RateModifiersList} from '../components/Dashboard/Rates/Rates';
import {TYPE_PERCENTAGE, TYPE_ABSOLUTE} from "../utils/api/rateModifiers";

import {
    action
} from '@storybook/addon-actions';

export default {
    title: 'Rates/RateModifierList',
    component: RateModifiersList
};
const ratesList = [
    {
        enabled: true,
        priceModifierType: TYPE_PERCENTAGE,
        priceModifierAmount: 10,
        roomTypeNames:['Single',' Double']
    },
    {
        enabled: true,
        priceModifierType: TYPE_PERCENTAGE,
        priceModifierAmount: -10
    }, {
        enabled: false,
        priceModifierType: TYPE_ABSOLUTE,
        priceModifierAmount: 10,
        roomTypeNames:['Single']
    }, {
        enabled: true,
        priceModifierType: TYPE_ABSOLUTE,
        priceModifierAmount: -10
    }
]

export const SampleList = () => (
    <RateModifiersList rateModifiers={ratesList} handlePropertyValueChange={action('handlePropertyValueChange')}
                       handleEditRateModifier={action('handleEditRateModifier')}/>)
