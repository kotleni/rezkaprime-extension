import './popup.css';
import React from 'react';
import ReactDOM from 'react-dom/client';

function Popup() {
    return <>Hello, world!</>;
}

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('Failed to find the root element');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
    <React.StrictMode>
        <Popup />
    </React.StrictMode>,
);
