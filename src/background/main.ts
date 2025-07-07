(chrome || browser).runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'DOWNLOAD_FILE') {
        const downloading = (chrome || browser).downloads.download({
            url: msg.payload.url,
            filename: msg.payload.fileName,
            conflictAction: 'uniquify',
        });
    }
});
