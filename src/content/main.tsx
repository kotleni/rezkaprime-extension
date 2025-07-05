import '../index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {ControlPanel} from './toolbar';

const targetElement = document.getElementsByClassName(
    'b-post__rating_table',
)[0];

if (targetElement) {
    const appRoot = document.createElement('div');
    targetElement.prepend(appRoot);

    const root = ReactDOM.createRoot(appRoot);
    root.render(
        <React.StrictMode>
            <ControlPanel />
        </React.StrictMode>,
    );
}
