import React from 'react'
import { createMuiTheme } from '@material-ui/core'
import { withStyles, ThemeProvider } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Chip from '@material-ui/core/Chip'
import { v4 as uuidv4 } from 'uuid'

import { objClone } from '../../../utils/functions'
import { dropDownThemeObj } from '../../../utils/themes'

const dropDownTheme = createMuiTheme(dropDownThemeObj)

const useStyles = (theme) => {
  return {
    container: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '16px'
    },
    select: {
      // padding: theme.spacing(0.5),
      margin: 0,
    },
    chips: {
      display: 'flex',
      justifyContent: 'left',
      flexWrap: 'wrap',
      listStyle: 'none',
      padding: theme.spacing(0.5),
      margin: 0,
    },
    chip: {
      margin: theme.spacing(0.5),
    },
    customInput: {
      width: (props) => { return `${props.inputWidth}px` },
    },
  }
}

class MultiAutocomplete extends React.Component {
  constructor(props) {
    super(props)

    this._isDestroyed = false

    const options = this.props.options.map((option) => {
      return {
        name: option.name,
        id: uuidv4(),
        disabled: false,
      }
    })

    const chipData = this.props.value.split(';').map((chipName) => {
      const optionMatch = options.find((option) => {
        return option.name === chipName
      })

      if (optionMatch) {
        optionMatch.disabled = true

        return {
          key: uuidv4(),
          label: chipName,
          optionId: optionMatch.id,
        }
      } else {
        return null
      }
    }).filter((el) => {
      return el !== null
    })

    this.state = {
      value: null,
      inputValue: '',
      chipData,
      options,
    }
  }

  componentWillUnmount() {
    this._isDestroyed = true
  }

  handleDeleteChip = (chipToDelete) => () => {
    const chipData = this.state.chipData.map((chip) => {
      return objClone(chip)
    }).filter((chip) => {
      return chip.key !== chipToDelete.key
    })

    const options = this.state.options.map((option) => {
      let disabled = option.disabled

      if (option.id === chipToDelete.optionId) {
        disabled = false
      }

      return Object.assign({}, objClone(option), objClone({ disabled }))
    })

    this.setState({
      chipData,
      options,
    })

    const newParentValue = chipData.reduce((acc, chip) => {
      return `${acc}${chip.label};`
    }, '')
    this.props.onValueChange(newParentValue)
  }

  handleAddChip = (option) => {
    const chipData = objClone(this.state.chipData)

    chipData.push({
      key: uuidv4(),
      label: option.name,
      optionId: option.id,
    })

    const options = this.state.options.map((_option) => {
      let disabled = _option.disabled

      if (_option.id === option.id) {
        disabled = true
      }

      return Object.assign({}, objClone(_option), objClone({ disabled }))
    })

    this.setState({
      chipData,
      options,
    })

    const newParentValue = chipData.reduce((acc, chip) => {
      return `${acc}${chip.label};`
    }, '')
    this.props.onValueChange(newParentValue)
  }

  setValue = (newValue) => {
    this.setState({
      value: null,
      inputValue: '',
    })

    if (newValue) {
      this.handleAddChip(newValue)
    }
  }

  setInputValue = (newValue) => {
    this.setState({
      inputValue: newValue,
    })
  }

  render () {
    const { classes } = this.props

    return (
      <div className={classes.container}>
        <div className={classes.select}>
          <ThemeProvider theme={dropDownTheme}>
            <Autocomplete
              value={this.state.value}
              onChange={(event, newValue) => {
                this.setValue(newValue)
              }}

              inputValue={this.state.inputValue}
              onInputChange={(event, newInputValue) => {
                this.setInputValue(newInputValue)
              }}

              options={this.state.options}
              getOptionLabel={(option) => option.name}
              getOptionDisabled={(option) => option.disabled}

              className={classes.customInput}

              renderInput={(params) => {
                return (
                  <TextField
                    {...params}
                    label={this.props.inputLabel}
                    variant="outlined"
                  />
                )
              }}
            />
          </ThemeProvider>
        </div>
        <div className={classes.chips}>
          {this.state.chipData.map((data) => {
            return (
              <li key={data.key}>
                <Chip
                  className={classes.chip}
                  label={data.label}
                  onDelete={this.handleDeleteChip(data)}
                  color="default"
                  variant="outlined"
                />
              </li>
            )
          })}
        </div>
      </div>
    )
  }
}

export default withStyles(useStyles)(MultiAutocomplete)
