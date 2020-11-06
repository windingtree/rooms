import { objClone } from './obj_clone'

const WHITE = '#ffffff'
const BLACK = '#000000'

const LIGHT_GRAY = '#bfbfbf'

const DARK_PURPLE = '#9e21af'
const MIDDLE_PURPLE = '#8f6882'
const LIGHT_PURPLE = '#d9abca'

const _baseMuiThemeObj = {
  palette: {
    primary: {
      light: WHITE,
      main: WHITE,
      dark: LIGHT_GRAY,
      contrastText: DARK_PURPLE,
    },
    secondary: {
      light: WHITE,
      main: LIGHT_PURPLE,
      dark: MIDDLE_PURPLE,
      contrastText: BLACK,
    },
  },
}

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

const baseMuiThemeObj = Object.assign(
  {},
  objClone(_baseMuiThemeObj)
)

const datePickerThemeObj = Object.assign(
  {},
  objClone(_baseMuiThemeObj),
  objClone(_datePickerThemeAdditionsObj)
)

const dropDownThemeObj = Object.assign(
  {},
  objClone(_baseMuiThemeObj),
  objClone(_dropDownThemeAdditionsObj)
)

export {
  baseMuiThemeObj,
  datePickerThemeObj,
  dropDownThemeObj,
}
