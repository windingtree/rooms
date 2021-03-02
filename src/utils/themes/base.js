import { objClone } from '../functions'

import {
  WHITE,
  LIGHT_GRAY,
  DARK_PURPLE,
  LIGHT_PURPLE,
  MIDDLE_PURPLE,
  BLACK
} from './theme_colors'

const _baseMuiThemeObj = {
  typography: {
    fontFamily: ['Inter'].join(',')
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
      contrastText: BLACK,
    },
  },
}

const baseMuiThemeObj = objClone(_baseMuiThemeObj)

export {
  _baseMuiThemeObj,
  baseMuiThemeObj,
}
