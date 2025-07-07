const fs = require('fs/promises');
const path = require('path');
const archiver = require('archiver');
const { exec } = require('child_process');

const SRC_DIR = path.join(__dirname, 'dist');
const BUILD_DIR = path.join(__dirname, 'builds');

async function main() {
  try {
    // Read manifest to get extension name and version
    const manifestPath = path.join(SRC_DIR, 'manifest.json');
    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));
    const { name, version } = manifest;

    // Sanitize the name for use in a filename
    const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const fileNameBase = `${sanitizedName}-v${version}`;

    console.log(`🚀 Starting packaging for ${name} v${version}...`);

    // Ensure the build directory exists
    await fs.mkdir(BUILD_DIR, { recursive: true });

    // Run packing for both browsers
    await packForChrome(fileNameBase);
    await packForFirefox(fileNameBase);

    console.log('\n✅ All packages created successfully in the "builds" directory!');

  } catch (error) {
    console.error('❌ An error occurred during packaging:', error);
    process.exit(1);
  }
}

// --- Chrome Packaging Function ---
function packForChrome(fileNameBase) {
  const filePath = path.join(BUILD_DIR, `${fileNameBase}-chrome.zip`);
  console.log(`\n📦 Creating Chrome package: ${path.basename(filePath)}`);

  return new Promise((resolve, reject) => {
    const output = require('fs').createWriteStream(filePath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Set compression level
    });

    output.on('close', () => {
      console.log(`   -> Chrome package complete. ${archive.pointer()} total bytes.`);
      resolve();
    });

    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        console.warn('Warning:', err);
      } else {
        reject(err);
      }
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);

    // Add all files from the dist directory to the root of the zip
    archive.directory(SRC_DIR, false);

    archive.finalize();
  });
}

// --- Firefox Packaging Function ---
function packForFirefox(fileNameBase) {
  const outputFilename = `${fileNameBase}-firefox.xpi`;
  console.log(`\n📦 Creating Firefox package: ${outputFilename}`);

  // We use Mozilla's `web-ext` tool, which is the standard and best way.
  // It ensures the manifest is validated and the package is structured correctly.
  const command = `npx web-ext build --source-dir ${SRC_DIR} --artifacts-dir ${BUILD_DIR} --filename ${outputFilename} --overwrite-dest`;

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`   -> Error while running web-ext: ${stderr}`);
        return reject(error);
      }
      console.log(stdout.trim());
      console.log('   -> Firefox package complete.');
      resolve();
    });
  });
}

main();