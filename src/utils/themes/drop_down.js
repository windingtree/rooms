import { objClone } from '../functions'

import {
  DARK_PURPLE,
  MIDDLE_PURPLE,
} from './theme_colors'

import { _baseMuiThemeObj } from './base'

const _dropDownThemeAdditionsObj = {
  overrides: {
    MuiFormLabel: {
      root: {
        '&$focused': {
          color: DARK_PURPLE,
          fontWeight: 'bold',
        },
      },
    },
    MuiOutlinedInput: {
      root: {
        '&:hover:not($disabled):not($focused):not($error) $notchedOutline': {
          borderColor: MIDDLE_PURPLE,
          borderWidth: '1px',
        },
        '&$focused $notchedOutline': {
          borderColor: MIDDLE_PURPLE,
          borderWidth: '1px',
        },
      },
    },
  },
}

const dropDownThemeObj = Object.assign(
  {},
  objClone(_baseMuiThemeObj),
  objClone(_dropDownThemeAdditionsObj)
)

export {
  dropDownThemeObj,
}
