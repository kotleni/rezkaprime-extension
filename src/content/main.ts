import css from './style.css?inline';
import downloadIconSvgString from '../assets/download-icon.svg?raw';

function addCssToPage(css: string) {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.append(style);
    console.log('CSS injected programmatically!');
}

if (window.location.hostname.includes('rezka')) {
    addCssToPage(css);

    const sendIssueBtn = document.getElementById('send-video-issue');
    const container = sendIssueBtn?.parentElement;

    function downloadBtnClicked() {}

    const downloadBtn = document.createElement('div');
    downloadBtn.className = 'boxButton';
    downloadBtn.innerHTML = downloadIconSvgString;
    downloadBtn.onclick = downloadBtnClicked;
    container?.appendChild(downloadBtn);
}
