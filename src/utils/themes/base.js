import { objClone } from '../functions'

import {
  WHITE,
  LIGHT_GRAY,
  DARK_PURPLE,
  MIDDLE_PURPLE
} from './theme_colors'

const _baseMuiThemeObj = {
  typography: {
    fontFamily: ['Inter'].join(','),
    fontWeightBold: 600,
    fontWeightNormal: 500,
    fontWeightLight: 400
  },
  palette: {
    primary: {
      light: WHITE,
      main: WHITE,
      dark: LIGHT_GRAY,
      contrastText: DARK_PURPLE,
    },
    secondary: {
      light: WHITE,
      main: DARK_PURPLE,
      dark: MIDDLE_PURPLE,
      contrastText: WHITE,
    },
  },
}

const baseMuiThemeObj = objClone(_baseMuiThemeObj)

export {
  _baseMuiThemeObj,
  baseMuiThemeObj,
}
