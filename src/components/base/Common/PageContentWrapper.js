import React from 'react';
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {roomsStyles} from "../../../utils/themes";

const useStyles = makeStyles({
    mainContent: {
        // minWidth: roomsStyles.forms.minWidth,
        maxWidth: roomsStyles.forms.maxWidth,
        marginTop:'20px',
        marginBottom:'20px'
    }
})



export const PageContentWrapper = ({children}) => {
    const classes = useStyles();
    return (
        <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            style={{ minHeight: '100%' }}
        >
            <Grid
                container
                direction="column"
                alignItems="stretch"
                className={classes.mainContent}
            >
                {children}
            </Grid>
        </Grid>
            )
}