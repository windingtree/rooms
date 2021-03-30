import React from 'react';

import RatesCard from '../../components/Dashboard/Rates/RatesCard';
import {TYPE_PERCENTAGE} from "../../utils/api/rateModifiers";

import {
    action
} from '@storybook/addon-actions';

export default {
    title: 'Rates/RatesCard',
    component: RatesCard
};
const rateModifier =
    {
        id:"603e45ac5aee549be476ee83",
        enabled: true,
        type:'Holiday peak70',
        priceModifierType: TYPE_PERCENTAGE,
        priceModifierAmount: 10,
        roomTypeNames:['Single',' Double'],
        priority:70
    }

export const RateCard = () => (
    <RatesCard
        key={rateModifier.id}
        rateModifier={rateModifier}
        roomTypeNames={rateModifier.roomTypeNames}
        handlePropertyValueChange={action('handlePropertyValueChange')}
        handleEditRateModifier={action('handleEditRateModifier')}/>)


