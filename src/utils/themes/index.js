import {createMuiTheme} from "@material-ui/core/styles";
import {baseMuiThemeObj} from "./base";

export {
  baseMuiThemeObj,
} from './base'

export {
  datePickerThemeObj,
} from './date_picker'

export {
  dropDownThemeObj,
} from './drop_down'

export const roomsTheme = createMuiTheme(baseMuiThemeObj)