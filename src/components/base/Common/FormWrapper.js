import React from 'react';
import Grid from "@material-ui/core/Grid";


export const FormWrapper = ({ children}) => {
    return (
        <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            style={{ minHeight: '100%' }}
        >

                {children}
        </Grid>
            )
}