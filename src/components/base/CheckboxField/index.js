import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from  '@material-ui/core/FormControlLabel'

const useStyles = makeStyles({
  field: {
    marginBottom: '16px',
    whiteSpace: 'nowrap'
  },
<<<<<<< HEAD
  root: {
    '&$checked': {
      color: `#9226AD !important`
    }
  },
  checked: {}
=======
  // root: {
  //   '&$checked': {
  //     color: `#9226AD !important`
  //   }
  // },
  checked: {
    color: '#9226AD !important'
  }
>>>>>>> upstream/develop
});

export default props => {
  const styles = useStyles();
  const {
    label,
    name,
    checked = false,
    onChange = () => {},
    ...restProps
  } = props;
  const [isChecked, setChecked] = useState(checked);

  const handleChange = () => {
    const newCheckedValue = !isChecked;
    setChecked(newCheckedValue);
    onChange(newCheckedValue);
  };

  return (
    <FormControlLabel
      className={styles.field}
      control={(
        <Checkbox
          checked={isChecked}
          onChange={handleChange}
          name={name}
          classes={{
<<<<<<< HEAD
            root: styles.root
=======
            checked: styles.checked
>>>>>>> upstream/develop
          }}
          {...restProps}
        />
      )}
      label={label}
    />
  );
};
