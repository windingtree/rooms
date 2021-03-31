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
  }
});

const SelectField = (props) => {
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
      color="secondary"
      variant="outlined"
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
export default SelectField;