
/**
 * Purpose: Category-based scaling generator — no model analysis, only category scaling.
 * Key features: Applies humanoid-relative scaling per folder using scalingDefaults.json.
 * Dependencies: Only filesystem.
 * MIT License: https://github.com/[new-repo-path]/LICENSE
 * Timestamp: 2025-06-25 12:05 | File: CategoryBasedScalingGenerator.js
 */

import fs from 'fs';
import path from 'path';

const TOWN = process.argv[2] || 'town1';

const ROOT_DIR = path.join('assets', 'towns', TOWN);
const OUTPUT_MANIFEST = path.join(ROOT_DIR, 'assetsManifest.json');
const OUTPUT_SCALING = path.join(ROOT_DIR, 'scalingConfig.json');
const DEFAULTS_FILE = 'scalingDefaults.json';

// ✅ You can keep extending these categories easily
const SUBFOLDERS = ['houses', 'trees', 'props', 'cars'];

function generateManifestAndScaling() {
    console.log(`[VRBox] Generating manifest + category-based scaling for town: ${TOWN}`);

    if (!fs.existsSync(DEFAULTS_FILE)) {
        throw new Error(`Missing ${DEFAULTS_FILE}. Please provide humanoidHeight and expected heights.`);
    }
    const defaults = JSON.parse(fs.readFileSync(DEFAULTS_FILE, 'utf-8'));
    const humanoidHeight = defaults.humanoidHeight || 2.0;

    const manifest = { houses: [], trees: [], props: [], cars: [] };
    const scalingConfig = {};

    for (const folder of SUBFOLDERS) {
        const fullFolder = path.join(ROOT_DIR, folder);
        if (!fs.existsSync(fullFolder)) continue;

        const expectedHeight = defaults[folder];
        if (!expectedHeight) {
            console.warn(`[VRBox] No expected height defined for ${folder}, skipping.`);
            continue;
        }

        const files = fs.readdirSync(fullFolder).filter(file => file.endsWith('.glb'));

        // Calculate category scaling only once:
        const categoryScale = parseFloat((humanoidHeight / expectedHeight).toFixed(3));
        console.log(`[VRBox] Category [${folder}] scale factor: ${categoryScale}`);

        for (const file of files) {
            const relPath = `assets/towns/${TOWN}/${folder}/${file}`;
            manifest[folder].push(relPath);
            scalingConfig[relPath] = categoryScale;
            console.log(`[VRBox] ${relPath} | scale=${categoryScale}`);
        }
    }

    fs.writeFileSync(OUTPUT_MANIFEST, JSON.stringify(manifest, null, 2));
    fs.writeFileSync(OUTPUT_SCALING, JSON.stringify(scalingConfig, null, 2));

    console.log(`[VRBox] Done!`);
}

generateManifestAndScaling();
