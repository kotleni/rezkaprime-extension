browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'DOWNLOAD_FILE') {
        const downloading = browser.downloads.download({
            url: msg.payload.url,
            filename: msg.payload.fileName,
            conflictAction: 'uniquify',
        });
    }
});
