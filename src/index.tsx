import React from 'react';
import ReactDOM from 'react-dom/client';
import { createTheme } from "@mui/material/styles";
import './index.css';
import Metamorph from './components/Metamorph/Metamorph';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import {CssBaseline, ThemeProvider} from "@mui/material";
import {init as zstdInit} from '@bokuweb/zstd-wasm';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#673fb5',
        },
        secondary: {
            main: '#f500f5',
        },
    },
});

const router = createBrowserRouter([
    {
        path: "/",
        element: <Metamorph />,
    },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

zstdInit().then(() => {
    root.render(
        <React.StrictMode>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <RouterProvider router={router} />
            </ThemeProvider>
        </React.StrictMode>
    );
})


