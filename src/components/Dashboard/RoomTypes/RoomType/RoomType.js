import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'

import TextField from '../../../base/TextEditInput/TextField'
import Spinner from '../../../base/Spinner/Spinner'

const useStyles = () => {
  return {
    grow: {
      flexGrow: 1,
    },
    room_type_card: {
      width: '765px',
      margin: '16px',
      maxWidth: '90vw'
    },
    price_currency: {
      display: 'inline',
      position: 'relative',
      top: '20px',
      left: '10px',
    },
    cardContent: {
      paddingBottom: '0px'
    }
  }
}

class RoomType extends React.Component {
  handleTrashClick = () => {
    this.props.onTrashClick(this.props.id)
  }

  handleEditClick = () => {
    this.props.onEditClick(this.props.id)
  }

  handleTypeChange = (e) => {
    if (e && e.target && typeof e.target.value === 'string') {
      this.props.onPropValueChange(this.props.id, 'type', e.target.value)
    }
  }

  // handleQuantityChange = (e) => {
  //   this.props.onPropValueChange(this.props.id, 'quantity', Number.parseInt(e, 10))
  // }

  // handlePriceChange = (e) => {
  //   this.props.onPropValueChange(this.props.id, 'price', Number.parseFloat(e))
  // }

  render() {
    const { classes } = this.props

    return (
      <Card className={classes.room_type_card}>
        <CardContent className={classes.cardContent}>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="stretch"
          >
            {
              (this.props.creating === true) ?
              <Spinner info="creating" /> :
              <>
                <Grid item>
                  <TextField
                    value={this.props.type}
                    label="Type"
                    onChange={this.handleTypeChange}
                    fullWidth={true}
                  />
                  {/* <TextField
                    value={this.props.quantity}
                    label="Quantity"
                    onChange={this.handleQuantityChange}
                    fullWidth={true}
                  /> */}
                </Grid>
                <Grid item>
                  {/* <TextField
                    value={this.props.price}
                    label="Price"
                    onChange={this.handlePriceChange}
                    inputWidth={90}
                  />
                  <div className={classes.price_currency}>USD</div> */}
                </Grid>
              </>
            }
          </Grid>
        </CardContent>
        <CardActions>
          {
            (this.props.creating === true)
            ? <></>
            : <>
                <IconButton aria-label="edit" onClick={this.handleEditClick}>
                  <EditIcon />
                </IconButton>
                <div className={classes.grow}></div>
                <IconButton aria-label="delete" onClick={this.handleTrashClick}>
                  <DeleteIcon />
                </IconButton>
              </>
          }
        </CardActions>
      </Card>
    )
  }
}

export default withStyles(useStyles)(RoomType)
