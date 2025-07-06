import React, {useState} from 'react';
import downloadIconContent from '../assets/download-icon.svg?raw';

export function ControlPanel() {
    const handleDownload = () => {};

    return (
        <div className="rezka-prime-toolbar">
            <h3 className="">My Extension Panel</h3>
            <p className="">aaaa</p>
            <div onClick={handleDownload} className="">
                {/* {downloadIconContent} */}
                <span>Download Video</span>
            </div>
        </div>
    );
}
