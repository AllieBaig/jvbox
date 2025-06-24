
/**
 * Purpose: Manifest generator using fully manual folder-based scaling config.
 * Key features: Auto-scans assets, fully controlled scaling per category.
 * Dependencies: Node.js, @gltf-transform/core (for reading glb but no geometry processing).
 * MIT License: https://github.com/[new-repo-path]/LICENSE
 * Timestamp: 2025-06-22 16:00 | File: ManualScalingManifestGenerator.js
 */

import fs from 'fs';
import path from 'path';
import { NodeIO } from '@gltf-transform/core';

const io = new NodeIO();

const TOWN = process.argv[2] || 'town1';

const ROOT_DIR = path.join('assets', 'towns', TOWN);
const OUTPUT_MANIFEST = path.join(ROOT_DIR, 'assetsManifest.json');
const OUTPUT_SCALING = path.join(ROOT_DIR, 'scalingConfig.json');
const DEFAULT_SCALING_FILE = 'scalingDefaults.json';

const SUBFOLDERS = ['houses', 'trees', 'props'];

async function generateManifestAndScaling() {
    console.log(`[VRBox] Generating manifest + scaling for town: ${TOWN}`);

    const manifest = { houses: [], trees: [], props: [] };
    const scalingConfig = {};

    let defaultScales = {};
    if (fs.existsSync(DEFAULT_SCALING_FILE)) {
        defaultScales = JSON.parse(fs.readFileSync(DEFAULT_SCALING_FILE, 'utf-8'));
    } else {
        console.warn(`[VRBox] WARNING: No scalingDefaults.json found, using 1.0 for all.`);
        defaultScales = { houses: 1.0, trees: 1.0, props: 1.0 };
    }

    for (const folder of SUBFOLDERS) {
        const fullFolder = path.join(ROOT_DIR, folder);
        if (!fs.existsSync(fullFolder)) continue;

        const files = fs.readdirSync(fullFolder).filter(file => file.endsWith('.glb'));

        for (const file of files) {
            const relPath = `assets/towns/${TOWN}/${folder}/${file}`;
            manifest[folder].push(relPath);

            const modelPath = path.join(fullFolder, file);
            await io.read(modelPath); // Validate file is loadable

            const assignedScale = defaultScales[folder] || 1.0;
            scalingConfig[relPath] = assignedScale;

            console.log(`[VRBox] ${relPath} | assigned manual scale ${assignedScale}`);
        }
    }

    fs.writeFileSync(OUTPUT_MANIFEST, JSON.stringify(manifest, null, 2));
    fs.writeFileSync(OUTPUT_SCALING, JSON.stringify(scalingConfig, null, 2));

    console.log(`[VRBox] Done!`);
}

generateManifestAndScaling();
