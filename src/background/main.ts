const browserApi = typeof browser !== 'undefined' ? browser : chrome;

browserApi.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'DOWNLOAD_VIDEO') {
        const {url, filename} = message.payload;

        console.log(`Received download request for: ${filename}`);
        browserApi.downloads
            .download({
                url: url,
                filename: filename,
                conflictAction: 'uniquify',
            })
            .then(downloadId => {
                console.log(`Download started with ID: ${downloadId}`);
                sendResponse({status: 'success'});
            })
            .catch(err => {
                console.error('Download failed:', err);
                sendResponse({status: 'error', message: err.message});
            });

        return true;
    }
});
