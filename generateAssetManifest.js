
/**
 * Purpose: Generate assetsManifest.json by scanning assets/models folder.
 * Key features: Fully automated manifest generation for VRBox v10.
 * Dependencies: Node.js (fs, path)
 * Function names: generateManifest()
 * MIT License: https://github.com/[new-repo-path]/LICENSE
 * Timestamp: 2025-06-22 11:50 | File: generateAssetManifest.js
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, 'assets/models');
const OUTPUT_FILE = path.join(__dirname, 'assets/assetsManifest.json');

function scanFolder(subfolder) {
    const dir = path.join(ROOT_DIR, subfolder);
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
        .filter(file => file.endsWith('.glb'))
        .map(file => `assets/models/${subfolder}/${file}`);
}

function generateManifest() {
    console.log("[VRBox] Generating asset manifest...");

    const manifest = {
        houses: scanFolder('houses'),
        trees: scanFolder('trees'),
        props: scanFolder('props')
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));
    console.log("[VRBox] Manifest generated:", OUTPUT_FILE);
}

generateManifest();
