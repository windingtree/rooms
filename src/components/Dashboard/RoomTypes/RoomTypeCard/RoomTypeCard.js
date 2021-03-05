import React from 'react'
import {useHistory} from 'react-router-dom'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import CardContent from '@material-ui/core/CardContent'
import makeStyles from "@material-ui/core/styles/makeStyles";
import {roomsTheme} from "../../../../utils/themes";

const useStyles = makeStyles( {
    card:{
        marginBottom:'10px',
        minWidth:'400px',
        width:'100%',
        cursor:'pointer'
    },
    room_name:{
        fontWeight:roomsTheme.typography.fontWeightBold,
        marginBottom:'8px'
    },
    rate:{
        fontWeight:roomsTheme.typography.fontWeightLight
    },
    rightAligned:{
        textAlign:'right'
    }
})


const RoomTypeCard = ({roomType})=>{
    const classes = useStyles();
    const {type,  quantity, price, currency} = roomType;
    const history = useHistory();
      const handleEditClick = () => {
        history.push(`/dashboard/room-types/${this.props.id}`)
      }
    return (
      <Card className={classes.card} onClick={handleEditClick}>
          <CardContent>
              <Grid
                  container
                  justify="center"
              >
                  <Grid item xs={9} className={classes.room_name}>
                      {type}
                  </Grid>
                  <Grid item xs={3} className={[classes.room_name,classes.rightAligned]}>
                      {quantity} units
                  </Grid>
                  <Grid item xs={9} className={classes.rate}>
                      Base rate per night
                  </Grid>
                  <Grid item xs={3} className={[classes.rate,classes.rightAligned]}>
                      {price}{currency}
                  </Grid>

              </Grid>
          </CardContent>
      </Card>
    )
}

export default RoomTypeCard
