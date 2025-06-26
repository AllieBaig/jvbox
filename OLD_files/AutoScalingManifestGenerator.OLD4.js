
/**
 * Purpose: Final fully-compatible manifest + scaling generator for glTF-Transform v4.x (array-based math).
 * Dependencies: @gltf-transform/core v4.x
 * MIT License: https://github.com/[new-repo-path]/LICENSE
 * Timestamp: 2025-06-22 14:40 | File: AutoScalingManifestGenerator.js
 */

import fs from 'fs';
import path from 'path';
import { NodeIO, MathUtils } from '@gltf-transform/core';

const io = new NodeIO();

const TOWN = process.argv[2] || 'town1';

const ROOT_DIR = path.join('assets', 'towns', TOWN);
const OUTPUT_MANIFEST = path.join(ROOT_DIR, 'assetsManifest.json');
const OUTPUT_SCALING = path.join(ROOT_DIR, 'scalingConfig.json');

const SUBFOLDERS = ['houses', 'trees', 'props'];

const STANDARD_HEIGHT = 3; // meters normalized height

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

            const meshes = document.getRoot().listMeshes();

            let min = [Infinity, Infinity, Infinity];
            let max = [-Infinity, -Infinity, -Infinity];

            for (const mesh of meshes) {
                for (const prim of mesh.listPrimitives()) {
                    const bounds = prim.computeBounds();
                    min = MathUtils.min(min, min, bounds.min);
                    max = MathUtils.max(max, max, bounds.max);
                }
            }

            const height = max[1] - min[1];
            const suggestedScale = (height > 0) ? STANDARD_HEIGHT / height : 1.0;

            scalingConfig[relPath] = parseFloat(suggestedScale.toFixed(3));
            console.log(`[VRBox] ${relPath} | height=${height.toFixed(2)} | scale=${suggestedScale.toFixed(3)}`);
        }
    }

    fs.writeFileSync(OUTPUT_MANIFEST, JSON.stringify(manifest, null, 2));
    fs.writeFileSync(OUTPUT_SCALING, JSON.stringify(scalingConfig, null, 2));

    console.log(`[VRBox] Done!`);
}

generateManifestAndScaling();
