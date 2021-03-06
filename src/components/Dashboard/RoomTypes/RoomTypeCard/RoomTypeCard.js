import React from 'react'
import { useHistory } from 'react-router-dom'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import makeStyles from '@material-ui/core/styles/makeStyles';
import { roomsTheme } from '../../../../utils/themes';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import currencies from '../../../../utils/data/currencies.json';
import { Typography } from '@material-ui/core'

const useStyles = makeStyles({
    card:{
        marginBottom:'10px',
        minWidth:'320px',
        width:'100%',
        cursor:'pointer'
    },
    roomPrice:{
        fontWeight:roomsTheme.typography.fontWeightRegular,
        fontSize: '16px',
        textAlign:'right'
    },
    roomType: {
        fontWeight:roomsTheme.typography.fontWeightRegular,
        fontSize: '16px',
    },
    numberUnits:{
        fontWeight:roomsTheme.typography.fontWeightBold,
        fontSize: '16px',
    },
    cardContentRoot: {
        paddingBottom: '16px !important'
    },
    mediaCardRoot: {
        minWidth: 'auto !important'
    },
    mediaRoot: {
        height: '23vh',
        margin: '16px 16px 0 16px',
        borderRadius: '8px',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    },
    bottomLine: {
        marginTop: '8px'
    },
    manageButtonText: {
        color: roomsTheme.palette.secondary.main,
        textTransform: 'none',
        fontSize: '16px',
    },
    manageButtonIcon: {
        color: roomsTheme.palette.secondary.main,
        marginLeft: '8px'
    }
})


const RoomTypeCard = props =>{
    const classes = useStyles();
    const {
        roomType
    } = props;
    const {
        type,
        quantity,
        price,
        currency,
        id,
        images
    } = roomType;
    const currencyObj = currencies.filter(c => c.value === currency)[0];
    const history = useHistory();
    const handleEditClick = () => {
        history.push(`/dashboard/room-types/${id}`)
    }

    return (
      <Card className={classes.card} onClick={handleEditClick}>
          {Array.isArray(images) && images.length > 0 &&
            <CardMedia
                classes={{
                    root: classes.mediaRoot
                }}
                alt={type}
                image={images[0]}
                title={type}
            />
          }
          <CardContent
            classes={{
                root: classes.cardContentRoot
            }}
          >
              <Grid
                container
                alignItems='baseline'
                justify='space-between'

              >
                <Grid item className={classes.roomType} xs={9}>
                    {type}
                </Grid>
                <Grid item className={classes.roomPrice} xs={3}>
                    {currencyObj.symbol}{price}/night
                </Grid>
            </Grid>
            <Grid
                container
                alignItems='center'
                justify='space-between'
                className={classes.bottomLine}
            >
                <Grid item className={classes.numberUnits}>
                {quantity} units
                </Grid>
                <Grid item>
                    <Grid container
                        wrap='nowrap'
                        onClick={handleEditClick}
                    >
                        <Grid item>
                            <Typography className={classes.manageButtonText}>
                                Manage
                            </Typography>
                        </Grid>
                        <Grid item>
                            <ArrowForwardIcon
                                className={classes.manageButtonIcon}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
          </CardContent>
      </Card>
    )
}

export default RoomTypeCard
