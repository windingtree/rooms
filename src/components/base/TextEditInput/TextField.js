import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'

const useStyles = makeStyles({
  field: {
    marginBottom: '16px'
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
  return (
    <TextField
      className={styles.field}
      variant='outlined'
      color='primary'
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
      {...props}
    />
  )
};
