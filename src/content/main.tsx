import '../index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {ControlPanel} from './toolbar';

const targetElement = document.getElementsByClassName(
    'b-post__rating_table',
)[0];

// Remove old root if exist
const oldRoot = targetElement.getElementsByTagName('div');
if (oldRoot[0]) {
    oldRoot[0].remove();
}

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
