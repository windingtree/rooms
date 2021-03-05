import React from 'react';
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {roomsStyles} from "../../../utils/themes";

const useStyles = makeStyles({
    mainContent: {
        // minWidth: roomsStyles.forms.minWidth,
        maxWidth: roomsStyles.forms.maxWidth,
        padding:'20px'
    },
    pageTitle: {
        marginBottom:'20px',
        fontSize: '1.75em'
    },
})



export const PageContentWrapper = ({title, children}) => {
    const classes = useStyles();
    return (
        <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            style={{ minHeight: '100%'}}
        >
            <Grid
                container
                direction="column"
                alignItems="stretch"
                className={classes.mainContent}
            >
                {title && <div className={classes.pageTitle}>{title}</div> }
                {children}
            </Grid>
        </Grid>
            )
}