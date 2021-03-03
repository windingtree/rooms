import React from 'react'
import {Paper, Tab, Tabs, Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";

export const Sandbox = () => {
    const [value, setValue] = React.useState(2);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <>
            <Paper square>
                <Tabs
                    value={value}
                    onChange={handleChange}
                >
                    <Tab label="Buttons"><ButtonsShowcase/></Tab>
                    <Tab label="Typography"><TypographyShowcase/></Tab>
                    <Tab label="Blah blah blah">test</Tab>
                </Tabs>
            </Paper>
            <p/>
            <Paper>
                {value === 0 && <ButtonsShowcase/>}
                {value === 1 && <TypographyShowcase/>}
            </Paper>
        </>
    )
}


export const TypographyShowcase = () => {

    return (
        <>
            <Typography variant="h1" component="h2" gutterBottom>
                h1. Heading
            </Typography>
            <Typography variant="h2" gutterBottom>
                h2. Heading
            </Typography>
            <Typography variant="h3" gutterBottom>
                h3. Heading
            </Typography>
            <Typography variant="h4" gutterBottom>
                h4. Heading
            </Typography>
            <Typography variant="h5" gutterBottom>
                h5. Heading
            </Typography>
            <Typography variant="h6" gutterBottom>
                h6. Heading
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
                subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
            </Typography>
            <Typography variant="body1" gutterBottom>
                body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
                unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam
                dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.
            </Typography>
            <Typography variant="body2" gutterBottom>
                body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
                unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam
                dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.
            </Typography>
            <Typography variant="button" display="block" gutterBottom>
                button text
            </Typography>
            <Typography variant="caption" display="block" gutterBottom>
                caption text
            </Typography>
            <Typography variant="overline" display="block" gutterBottom>
                overline text
            </Typography>
        </>
    )
}

export const ButtonsShowcase = () => {
    return (
        <div>
            <Button variant="contained">Default</Button>
            <Button variant="contained" color="primary">
                Primary
            </Button>
            <Button variant="contained" color="secondary">
                Secondary
            </Button>
            <Button variant="contained" disabled>
                Disabled
            </Button>
            <Button variant="contained" color="primary" href="#contained-buttons">
                Link
            </Button>
        </div>
    )
}

