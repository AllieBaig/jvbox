
/**
 * Purpose: Fully automatic manifest and scaling config generator for VRBox v10.
 * Key features: Scans all GLB models, reads bounding boxes, generates both manifests.
 * Dependencies: Node.js, gltf-transform
 * Function names: generateManifestAndScaling()
 * MIT License: https://github.com/[new-repo-path]/LICENSE
 * Timestamp: 2025-06-22 13:15 | File: AutoScalingManifestGenerator.js
 */

import fs from 'fs';
import path from 'path';
import { NodeIO } from '@gltf-transform/core';
import { bounds } from '@gltf-transform/functions';

const io = new NodeIO();

const TOWN = process.argv[2] || 'town1';

const ROOT_DIR = path.join('assets', 'towns', TOWN);
const OUTPUT_MANIFEST = path.join(ROOT_DIR, 'assetsManifest.json');
const OUTPUT_SCALING = path.join(ROOT_DIR, 'scalingConfig.json');

const SUBFOLDERS = ['houses', 'trees', 'props'];

const STANDARD_HEIGHT = 3; // meters target size for tallest model

async function generateManifestAndScaling() {
    console.log(`[VRBox] Generating manifest + scaling for town: ${TOWN}`);

    const manifest = { houses: [], trees: [], props: [] };
    const scalingConfig = {};

    for (const folder of SUBFOLDERS) {
        const fullFolder = path.join(ROOT_DIR, folder);
        if (!fs.existsSync(fullFolder)) continue;

        const files = fs.readdirSync(fullFolder).filter(file => file.endsWith('.glb'));

        for (const file of files) {
            const relPath = `assets/towns/${TOWN}/${folder}/${file}`;
            manifest[folder].push(relPath);

            const modelPath = path.join(fullFolder, file);
            const document = await io.read(modelPath);
            const { min, max } = bounds(document);
            const height = max[1] - min[1];
            const suggestedScale = (height > 0) ? STANDARD_HEIGHT / height : 1.0;

            scalingConfig[relPath] = parseFloat(suggestedScale.toFixed(3));
            console.log(`[VRBox] Processed: ${relPath} | height=${height.toFixed(2)} | scale=${suggestedScale.toFixed(3)}`);
        }
    }

    fs.writeFileSync(OUTPUT_MANIFEST, JSON.stringify(manifest, null, 2));
    fs.writeFileSync(OUTPUT_SCALING, JSON.stringify(scalingConfig, null, 2));

    console.log(`[VRBox] Done! Files generated:`);
    console.log(`  -> ${OUTPUT_MANIFEST}`);
    console.log(`  -> ${OUTPUT_SCALING}`);
}

generateManifestAndScaling();
