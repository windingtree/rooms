import React from 'react';

import {ThemeProvider} from '@material-ui/core/styles'
import {roomsTheme} from '../src/utils/themes/index'

import '../src/index.css'

export const decorators = [
    (story) => (
        <ThemeProvider theme={roomsTheme}>
            {story()}
        </ThemeProvider>
    ),
];

export const parameters = {
    actions: {argTypesRegex: "^on[A-Z].*"},
}
