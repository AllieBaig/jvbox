
/**
 * Purpose: Generate manifest for selected town folder.
 * Key features: Support multiple town asset folders.
 * Dependencies: Node.js (fs, path)
 * Function names: generateManifest()
 * MIT License: https://github.com/[new-repo-path]/LICENSE
 * Timestamp: 2025-06-22 12:00 | File: generateAssetManifest.js
 */

const fs = require('fs');
const path = require('path');

const TOWN = process.argv[2] || 'town1'; // default town1 if not provided

const ROOT_DIR = path.join(__dirname, `assets/towns/${TOWN}`);
const OUTPUT_FILE = path.join(ROOT_DIR, 'assetsManifest.json');

function scanFolder(subfolder) {
    const dir = path.join(ROOT_DIR, subfolder);
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
        .filter(file => file.endsWith('.glb'))
        .map(file => `assets/towns/${TOWN}/${subfolder}/${file}`);
}

function generateManifest() {
    console.log(`[VRBox] Generating manifest for: ${TOWN}`);

    const manifest = {
        houses: scanFolder('houses'),
        trees: scanFolder('trees'),
        props: scanFolder('props')
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));
    console.log(`[VRBox] Manifest written: ${OUTPUT_FILE}`);
}

generateManifest();
