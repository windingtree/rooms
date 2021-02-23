import { IRateModifierConditionType } from "../../../common/types";

function rateModifierConditionTypeFromString(criteriaType?: string): IRateModifierConditionType {
    switch (criteriaType) {
        case IRateModifierConditionType.DAY_OF_WEEK:
            return IRateModifierConditionType.DAY_OF_WEEK;
        case IRateModifierConditionType.DATE_RANGE:
            return IRateModifierConditionType.DATE_RANGE;
        case IRateModifierConditionType.LENGTH_OF_STAY:
            return IRateModifierConditionType.LENGTH_OF_STAY;
        default:
            return IRateModifierConditionType.UNSPECIFIED;
    }
}

export { rateModifierConditionTypeFromString }
