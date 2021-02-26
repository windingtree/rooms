import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'

const useStyles = makeStyles({
  field: {
    marginBottom: '16px',
    '&.noBottomMargin': {
      marginBottom: 0
    }
  },
  cssOutlinedInput: {
    '&$cssFocused $notchedOutline': {
      borderColor: `#9226AD !important`,
    },
    color: '#42424F !important'
  },
  cssFocused: {
    borderWidth: '1px',
    borderColor: '#9226AD !important'
  },
  notchedOutline: {
    borderWidth: '1px',
    borderColor: '#C7C7C7 !important'
  },
  cssLabel: {
    color : '#757575 !important'
  },
  cssLabelFocused: {
    color : '#9226AD !important'
  }
});

export default props => {
  const styles = useStyles();
  const {
    value = '',
    onChange = () => {},
    options = [],
    bottomMargin = true,
    ...restProps
  } = props;
  const [selectValue, setSelectValue] = useState(value);

  const handleChange = e => {
    setSelectValue(e.target.value);
    onChange(e.target.value);
  };

  return (
    <TextField
      select
      className={`${styles.field} ${bottomMargin ? '' : 'noBottomMargin'}`}
      value={selectValue}
      onChange={handleChange}
      variant='outlined'
      InputProps={{
        classes: {
          root: styles.cssOutlinedInput,
          focused: styles.cssFocused,
          notchedOutline: styles.notchedOutline,
        }
      }}
      InputLabelProps={{
        classes: {
          root: styles.cssLabel,
          focused: styles.cssLabelFocused
        }
      }}
      {...restProps}
    >
      <MenuItem value=''></MenuItem>
      {options.map((item, index) => (
        <MenuItem
          key={index}
          value={item.value}
        >
          {item.label}
        </MenuItem>
      ))}
    </TextField>
  );
};
