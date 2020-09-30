import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'

const useStyles = (theme) => {
  return {
    text_edit_input_container: {
      marginTop: '2em',
      marginBottom: '2em',
      marginLeft: '1em',
      width: '200px',
      cursor: 'pointer',
      height: '3em',
    },
    simple_text_container: {
      display: 'block',
      height: '32px',
    },
    simple_text_label: {
      position: 'relative',
      display: 'block',
      top: '-7px',
      left: '14px',
      fontSize: '0.75em',
      color: theme.palette.secondary.main,
    },
    simple_text_value: {
      display: 'inline',
      width: '200px',
      maxWidth: '200px',
      padding: '18.5px 14px',
      height: '1.1876em',
      minInlineSize: 'min-content',
      fontSize: '1rem',
      fontWeight: '400',
      lineHeight: '1.7em',
      letterSpacing: '0.00938em',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    },
    underline: {
      width: '180px',
      height: '2px',
      background: `
        repeating-linear-gradient(
        to right,
        #fff,
        #fff 4px,
        ${theme.palette.secondary.main} 8px,
        ${theme.palette.secondary.main} 8px
        )
      `,
      left: '5px',
      top: '2px',
      position: 'relative',
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
      textLabel: this.props.label,
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

  handleTextUpdate(e) {
    if (e && e.target && e.target.value) {
      this.setState({ textValue: e.target.value })
    }
  }

  handleKeyUp(e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
      if (this.state.isTextEditable === false) {
        return
      }

      this.props.onValueChange(this.state.textValue)
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
    const MAX_LENGTH = 24

    return (str.length > MAX_LENGTH) ? str.substr(0, MAX_LENGTH - 1) + '...' : str
  }

  mouseDownHandler(e) {
    if (this._isDestroyed === true) {
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

    this.props.onValueChange(this.state.textValue)
    this.setState({ isTextEditable: false })
  }

  render () {
    const { classes } = this.props

    return (
      <div className={classes.text_edit_input_container} ref={this.nodeRef}>
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
            /> :
            <div className={classes.simple_text_container}>
              <div className={classes.simple_text_label}>{this.state.textLabel}</div>
              <div className={classes.simple_text_value}>{this.shortStr(this.state.textValue)}</div>
              <div className={classes.underline} />
            </div>
        }
      </div>
    )
  }
}

export default withStyles(useStyles)(TextEditInput)
