import { objClone } from '../functions'

import {
  WHITE,
  LIGHT_GRAY,
  DARK_PURPLE
} from './theme_colors'

import { _baseMuiThemeObj } from './base'

const _datePickerThemeAdditionsObj = {
  overrides: {
    MuiPickersDay: {
      daySelected: {
        color: WHITE,
      },
      current: {
        color: DARK_PURPLE,
        backgroundColor: LIGHT_GRAY,
      },
    },
  },
  palette: {
    primary: {
      main: DARK_PURPLE,
    },
  },
}

const datePickerThemeObj = Object.assign(
  {},
  objClone(_baseMuiThemeObj),
  objClone(_datePickerThemeAdditionsObj)
)

export {
  datePickerThemeObj,
}
