import '../index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {ControlPanel} from './toolbar';
import { doc } from 'prettier';

// TODO: Make similar btn in toolbar

// Remove report button
const reportBtn = document.getElementById('send-video-issue');
reportBtn?.remove();

// Remove report button description
const reportBtnDesc = document.getElementsByClassName('b-post__support_holder');
reportBtnDesc[0].remove();

// TODO: Add toggle setting
// Remove warnings under player
const warningMsg = document.getElementsByClassName('b-post__wait_status');
warningMsg[0].innerHTML = '';

const targetElement = document.getElementsByClassName(
    'b-post__social_holder_wrapper',
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
