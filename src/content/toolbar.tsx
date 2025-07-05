import React, {useState} from 'react';
import downloadIconContent from '../assets/download-icon.svg?raw';

export function ControlPanel() {
    const handleDownload = () => {};

    return (
        <div className="bg-red-500 text-white p-4">
            <h3 className="font-bold text-lg mb-2">My Extension Panel</h3>
            <p className="text-sm text-gray-400 mb-4">aaaa</p>
            <div onClick={handleDownload} className="">
                {/* {downloadIconContent} */}
                <span>Download Video</span>
            </div>
        </div>
    );
}
