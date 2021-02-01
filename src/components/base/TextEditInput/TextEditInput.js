import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'

const DEFAULT_INPUT_WIDTH = 200
const DEFAULT_INPUT_LABEL = 'Label'

function isFunction(functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
}

function measureText(text) {
  if (!window._tempDivForMeasurement) {
    window._tempDivForMeasurement = document.createElement('div')

    document.body.appendChild(window._tempDivForMeasurement)

    window._tempDivForMeasurement.style.fontSize = '1rem'
    window._tempDivForMeasurement.style.fontFamily = 'Roboto'
    window._tempDivForMeasurement.style.fontWeight = 400
    window._tempDivForMeasurement.style.letterSpacing = '0.00938em'
    window._tempDivForMeasurement.style.lineHeight = '1.7em'
    window._tempDivForMeasurement.style.minInlineSize = 'min-content'

    window._tempDivForMeasurement.style.paddingLeft = '14px'
    window._tempDivForMeasurement.style.paddingRight = '14px'

    window._tempDivForMeasurement.style.position = 'absolute'
    window._tempDivForMeasurement.style.display = 'inline'
    window._tempDivForMeasurement.style.left = '-1000px'
    window._tempDivForMeasurement.style.top = '-1000px'
  }

  window._tempDivForMeasurement.innerHTML = text

  return window._tempDivForMeasurement.clientWidth
}

const useStyles = (theme) => {
  return {
    container: {
      display: 'inline-block',
      width: (props) => {
        let inputWidth = DEFAULT_INPUT_WIDTH
        if (typeof props.inputWidth === 'number') {
          inputWidth = props.inputWidth
        }

        return `${inputWidth}px`
      },
      height: '4em',
      cursor: (props) => {
        if (props.editable === false) {
          return 'default'
        }

        return 'pointer'
      },
    },
    simple_text_container: {
      display: 'inline-flex',
      flexDirection: 'column',
      position: 'relative',
    },
    simple_text_label: {
      position: 'relative',
      display: 'inline-flex',
      left: '14px',
      fontSize: '0.75em',
      color: theme.palette.secondary.main,
    },
    simple_text_value: {
      position: 'relative',
      display: 'inline-flex',
      padding: '0px 14px 0px 14px',
      minInlineSize: 'min-content',
      fontSize: '1rem',
      fontWeight: '400',
      lineHeight: '1.7em',
      minHeight: '1.7em',
      letterSpacing: '0.00938em',
      whiteSpace: 'nowrap',
    },
    simple_text_underline: {
      position: 'relative',
      display: 'inline-flex',
      width: (props) => {
        let inputWidth = DEFAULT_INPUT_WIDTH
        if (typeof props.inputWidth === 'number') {
          inputWidth = props.inputWidth
        }

        return `${inputWidth}px`
      },
      height: '2px',
      background: `
        repeating-linear-gradient(
        to right,
        transparent,
        transparent 3px,
        ${theme.palette.secondary.main} 2px,
        ${theme.palette.secondary.main} 4px
        )
      `,
      left: '5px',
    }
  }
}

class TextEditInput extends React.Component {
  constructor(props) {
    super(props)

    this._isDestroyed = false
    this.nodeRef = React.createRef()
    this.textInputRef = React.createRef()
    this.mouseDownListener = (e) => {this.mouseDownHandler(e)}

    this.state = {
      textValue: this.props.value,
      textLabel: (this.props.label) ? this.props.label : DEFAULT_INPUT_LABEL,
      isTextEditable: false,
    }
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.mouseDownListener)
  }

  componentWillUnmount() {
    this._isDestroyed = true
    document.removeEventListener('mousedown', this.mouseDownListener)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps) {
      if (typeof prevProps.value === 'string') {
        if (prevProps.value !== this.props.value) {
          this.setState({
            textValue: this.props.value
          })
        }
      }

      if (typeof prevProps.label === 'string') {
        if (prevProps.label !== this.props.label) {
          this.setState({
            textLabel: (this.props.label) ? this.props.label : DEFAULT_INPUT_LABEL
          })
        }
      }
    }
  }

  handleTextUpdate(e) {
    if (e && e.target && typeof e.target.value === 'string') {
      this.setState({ textValue: e.target.value })
    }
  }

  handleKeyUp(e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
      if (this.state.isTextEditable === false) {
        return
      }

      if (isFunction(this.props.onValueChange)) {
        this.props.onValueChange(this.state.textValue)
      }

      this.setState({ isTextEditable: false })
    } else if (e.key === 'Escape' || e.keyCode === 27) {
      if (this.state.isTextEditable === false) {
        return
      }

      this.setState({ textValue: this.props.value })
      this.setState({ isTextEditable: false })
    }
  }

  shortStr(str) {
    if ((typeof str === 'undefined') || (str === null)) {
      return ''
    } else if (typeof str === 'number') {
      str = str.toString()
    } else if (typeof str !== 'string') {
      return ''
    }

    let MAX_LENGTH = str.length + 1
    let shortStr = str.substr(0, MAX_LENGTH - 1)
    let strPixelLength = measureText(`${shortStr}...`)

    let inputWidth = DEFAULT_INPUT_WIDTH
    if (typeof this.props.inputWidth === 'number') {
      inputWidth = this.props.inputWidth
    }

    while (strPixelLength - 14 >= inputWidth) {
      MAX_LENGTH -= 1
      shortStr = str.substr(0, MAX_LENGTH - 1)
      strPixelLength = measureText(`${shortStr}...`)
    }

    return (MAX_LENGTH < str.length + 1) ? `${shortStr}...` : str
  }

  mouseDownHandler(e) {
    if (this._isDestroyed === true) {
      return
    }

    if (this.props.editable === false) {
      return
    }

    if (this.nodeRef.current.contains(e.target)) {
      if (this.state.isTextEditable === true) {
        return
      }

      this.setState({ isTextEditable: true })

      window.setTimeout(() => {
        this.textInputRef.current.focus()
      }, 10)

      return
    }

    if (this.state.isTextEditable === false) {
      return
    }

    if (isFunction(this.props.onValueChange)) {
      this.props.onValueChange(this.state.textValue)
    }

    this.setState({ isTextEditable: false })
  }

  render () {
    const { classes } = this.props

    return (
      <div className={classes.container} ref={this.nodeRef}>
        {
          (this.state.isTextEditable === true) ?
            <TextField
              inputRef={this.textInputRef}
              color="secondary"
              variant="outlined"
              defaultValue={this.state.textValue}
              label={this.state.textLabel}
              onChange={(e) => {this.handleTextUpdate(e)}}
              onKeyUp={(e) => {this.handleKeyUp(e)}}
              fullWidth={true}
            /> :
            <div className={classes.simple_text_container}>
              <div className={classes.simple_text_label}>{this.state.textLabel}</div>
              <div className={classes.simple_text_value}>{this.shortStr(this.state.textValue)}</div>
              <div className={classes.simple_text_underline} />
            </div>
        }
      </div>
    )
  }
}

export default withStyles(useStyles)(TextEditInput)
