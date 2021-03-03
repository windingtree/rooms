import React from 'react';

import {RateModifierListItem} from '../../components/Dashboard/Rates/Rates';
import {TYPE_PERCENTAGE} from "../../utils/api/rateModifiers";

import {
    action
} from '@storybook/addon-actions';

export default {
    title: 'Rates/RateModifierListItem',
    component: RateModifierListItem
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

export const RateModifierItem = () => (
    <RateModifierListItem
        key={rateModifier.id}
        id={rateModifier.id}
        type={rateModifier.type}
        enabled={rateModifier.enabled}
        roomTypeNames={rateModifier.roomTypeNames}
        priceModifierAmount={rateModifier.priceModifierAmount}
        priceModifierType={rateModifier.priceModifierType}
        handlePropertyValueChange={action('handlePropertyValueChange')}
        handleEditRateModifier={action('handleEditRateModifier')}/>)


