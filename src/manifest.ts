import type {Manifest} from 'web-extension-manifest';

type Browser = 'chrome' | 'firefox';

const createBaseManifest = (): Manifest => {
    return {
        manifest_version: 3,
        name: 'Rezka Prime',
        // version: pkg.version,
        version: '0.1.1',
        description:
            'A browser extension created for adding custom features like downloading video files and subtitles from HDrezka and its mirrors.',
        icons: {
            '48': 'icon48.png',
        },
        permissions: ['activeTab', 'storage', 'tabs', 'scripting', 'downloads'],
        host_permissions: ['<all_urls>'],
        action: {
            default_icon: 'icon48.png',
            default_title: 'RezkaPrime',
            default_popup: 'src/popup/popup.html',
        },
        content_scripts: [
            {
                matches: ['<all_urls>'],
                css: ['assets/styles.css'],
                js: ['bridge.js'],
            },
        ],
        web_accessible_resources: [
            {
                resources: ['bridge.js', 'content.js'],
                matches: ['<all_urls>'],
            },
        ],
    };
};

export function getManifest(browser: Browser): Manifest {
    const baseManifest = createBaseManifest();

    // If firefox
    if (browser === 'firefox') {
        return {
            ...baseManifest,
            background: {
                scripts: ['background.js'],
                type: 'module',
            },
            browser_specific_settings: {
                gecko: {
                    id: 'rezkaprime@kotleni',
                },
            },
        };
    }

    // Otherwise, default to Chrome's manifest
    return {
        ...baseManifest,
        background: {
            service_worker: 'background.js',
            type: 'module',
        },
    };
}
