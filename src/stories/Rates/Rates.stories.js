import React from 'react';

import RateModifiersList from '../../components/Dashboard/Rates/RatesList';
import {TYPE_PERCENTAGE, TYPE_ABSOLUTE} from "../../utils/api/rateModifiers";

import {
    action
} from '@storybook/addon-actions';

export default {
    title: 'Rates/RateModifiersList',
    component: RateModifiersList
};
const ratesList = [
    {
        id:"603e45ac5aee549be476ee83",
        enabled: true,
        type:'Holiday peak70',
        priceModifierType: TYPE_PERCENTAGE,
        priceModifierAmount: 10,
        roomTypeNames:['Single',' Double'],
        priority:70
    },
    {
        id:"603e45ac5aee549be476ee84",
        enabled: true,
        type:'Summer discount80',
        priceModifierType: TYPE_PERCENTAGE,
        priceModifierAmount: -10,
        priority:80
    }, {
        id:"603e45ac5aee549be476ee85",
        enabled: false,
        type:'Weekend high demand90',
        priceModifierType: TYPE_ABSOLUTE,
        priceModifierAmount: 10,
        roomTypeNames:['Single'],
        priority:90
    }, {
        id:"603e45ac5aee549be476ee86",
        enabled: true,
        type:'Some dummy discount100',
        priceModifierType: TYPE_ABSOLUTE,
        priceModifierAmount: -10,
        priority:100
    }
]
const roomTypes = [{
    "id": "6038c50e0422a24eafff41e2",
    "type": "Single room",
}, {
    "id": "6038c51965f3334f02c63843",
    "type": "Double room",
}]
export const SampleList = () => (
    <RateModifiersList rateModifiers={ratesList} roomTypes={roomTypes} handlePropertyValueChange={action('handlePropertyValueChange')}
                       handleEditRateModifier={action('handleEditRateModifier')}/>)


export const EmptyList = () => (
    <RateModifiersList rateModifiers={[]} roomTypes={roomTypes} handlePropertyValueChange={action('handlePropertyValueChange')}
                       handleEditRateModifier={action('handleEditRateModifier')}/>)
