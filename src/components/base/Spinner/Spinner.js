import React from 'react'
import Grid from '@material-ui/core/Grid'

import './Spinner.css'

class Spinner extends React.Component {
  render() {
    return (
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        style={{ minHeight: '100%', height: '100%' }}
      >
        <div className="grow"></div>
        <div className="spinner">
          <div className="lds-roller">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className="info">{this.props.info}</div>
        </div>
        <div className="grow"></div>
      </Grid>
    )
  }
}

export default Spinner
