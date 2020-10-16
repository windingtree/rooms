const _baseMuiThemeObj = {
  palette: {
    primary: {
      light: '#ffffff',
      main: '#fff',
      dark: '#bfbfbf',
      contrastText: '#9e21af',
    },
    secondary: {
      light: '#ffffff',
      main: '#d9abca',
      dark: '#8f6882',
      contrastText: '#000000',
    },
  },
}

const _datePickerThemeAdditionsObj = {
  overrides: {
    MuiPickersDay: {
      daySelected: {
        color: '#ffffff'
      },
      current: {
        color: "#545362",
      },
    },
  },
  palette: {
    primary: {
      main: '#9e21af',
    },
  },
}

const baseMuiThemeObj = Object.assign({}, JSON.parse(JSON.stringify(_baseMuiThemeObj)))

const datePickerThemeObj = Object.assign(
  {},
  JSON.parse(JSON.stringify(_baseMuiThemeObj)),
  JSON.parse(JSON.stringify(_datePickerThemeAdditionsObj))
)

export {
  baseMuiThemeObj,
  datePickerThemeObj
}
