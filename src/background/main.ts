const browserApi = typeof browser !== "undefined" ? browser : chrome;

window.addEventListener('message', (event)  => {
    if (event.data.type === 'DOWNLOAD_VIDEO') {
        const {url, filename} = event.data.payload;

        console.log(`Received download request for: ${filename}`);
        browserApi.downloads
            .download({
                url: url,
                filename: filename,
                conflictAction: 'uniquify',
            })
            // .then(downloadId => {
            //     console.log(`Download started with ID: ${downloadId}`);
            //     sendResponse({status: 'success'});
            // })
            // .catch(err => {
            //     console.error('Download failed:', err);
            //     sendResponse({status: 'error', message: err.message});
            // });

        return true;
    }
});
