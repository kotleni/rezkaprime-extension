<img width=80 src="https://github.com/kotleni/rezkaprime-extension/blob/dev/public/icon48.png?raw=true" align=right>

# RezkaPrime Extension
RezkaPrime is a browser extension created for adding custom features like downloading video files and subtitles from HDrezka and its mirrors. It's works very fast (not like other extensions).<br>
[[Download]](https://github.com/kotleni/rezkaprime-extension/releases)
[[Report bug]](https://github.com/kotleni/rezkaprime-extension/issues)

<img width=400 src="https://github.com/kotleni/rezkaprime-extension/blob/dev/public/preview1.png?raw=true">

## Features

- Download video files in any quality.
- Download subtitles in VTT format.
- Integrated directly under player.
- Works really fast.

## Browser Support

| Feature / Browser | Chrome/Edge | Firefox | Firefox Mobile | Safari |
| :---------------- | :----: | :-----: | :--: | ---- |
| Video Download    |   ✅ |   ✅    | ❌*1 | ❌*2 |
| Subtitle Download |   ✅ |   ✅    | ❌*1 | ❌*2 |

❔ - Not tested<br>
❌ - Not supported<br>
✅ - Supported<br>

\*1 Firefox Mobile support is currently broken.<br>
\*2 Safari support is currently broken.<br>

## Installation

### Chrome/Chromium/Edge

1. Download the latest `.zip` release from the [Releases page](https://github.com/kotleni/rezkaprime-extension/releases).
2. Unzip the downloaded file.
3. Open Chrome/Chromium/Edge and navigate to `chrome://extensions` (or `edge://extensions`).
4. Enable "Developer mode" in the top right corner.
5. Click "Load unpacked" and select the unzipped extension folder.

### Firefox

1. Download extension from Firefox Addons [here](https://addons.mozilla.org/en-US/firefox/addon/rezka-prime/).
2. Or download the latest `.xpi` release from the [Releases page](https://github.com/kotleni/rezkaprime-extension/releases).
3. Open Firefox and navigate to `about:addons`.
4. Click the gear icon (⚙️) and select "Install Add-on From File...".
5. Select the downloaded `.xpi` file.

## Building by youself
1. Clone this repository `$ git clone https://github.com/kotleni/rezkaprime-extension`
2. Install pnpm globally `# npm i -g pnpm`
3. Install dependencies `$ pnpm i`
5. Build & pack the extension `$ pnpm run pack:firefox` (for firefox) and `$ pnpm run pack:chrome` (for chrome)

Now you can see `dist` folder with unpacked extension and `builds` folder with unsigned packed extensions.

## Usage

Once installed, navigate to any video page on HDrezka or its mirrors. You will find new download options integrated under the video player. Simply click the desired download button for video or subtitles.

## License

This project is licensed under the GPL-2.0 License - see the [LICENSE](LICENSE) file for details.