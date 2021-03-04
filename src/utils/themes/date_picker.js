import { objClone } from '../functions'

import {
  LIGHT_GRAY,
  DARK_PURPLE, BLACK
} from './theme_colors'

import { _baseMuiThemeObj } from './base'

const _datePickerThemeAdditionsObj = {
  overrides: {
    MuiPickersDay: {
      daySelected: {
        color: DARK_PURPLE,
      },
      current: {
        color: BLACK,
        backgroundColor: LIGHT_GRAY,
      },
    },
  }
}

const datePickerThemeObj = Object.assign(
  {},
  objClone(_baseMuiThemeObj),
  objClone(_datePickerThemeAdditionsObj)
)

export {
  datePickerThemeObj,
}
