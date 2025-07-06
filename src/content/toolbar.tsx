import React, {useState} from 'react';
import { DownloadIcon } from '../components/download-icon';

export function ControlPanel() {
    const handleDownload = () => {};

    return (
        <div className="rezka-prime-toolbar">
            <h3 className="">Rezka Prime</h3>
            <select className="rezka-select">
                <option>480p</option>
                <option>720p</option>
                <option>1080p</option>
            </select>
            <div onClick={handleDownload} className="rezka-button">
                <DownloadIcon />
            </div>
        </div>
    );
}
