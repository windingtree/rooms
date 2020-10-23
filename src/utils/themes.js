const WHITE = '#ffffff'
const BLACK = '#000000'

const DARK_GRAY = '#bfbfbf'
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
        color: DARK_GRAY,
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
  JSON.parse(JSON.stringify(_baseMuiThemeObj))
)

const datePickerThemeObj = Object.assign(
  {},
  JSON.parse(JSON.stringify(_baseMuiThemeObj)),
  JSON.parse(JSON.stringify(_datePickerThemeAdditionsObj))
)

const dropDownThemeObj = Object.assign(
  {},
  JSON.parse(JSON.stringify(_baseMuiThemeObj)),
  JSON.parse(JSON.stringify(_dropDownThemeAdditionsObj))
)

export {
  baseMuiThemeObj,
  datePickerThemeObj,
  dropDownThemeObj,
}
