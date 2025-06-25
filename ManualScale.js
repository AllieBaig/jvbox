
/**
 * Purpose: Fully stable humanoid-relative scaling generator with sanity clamping.
 * Key features: Prevents extreme asset size errors, keeps auto-scaling safe.
 * Dependencies: @gltf-transform/core (any version)
 * MIT License: https://github.com/[new-repo-path]/LICENSE
 * Timestamp: 2025-06-22 17:45 | File: AutoScalingManifestGenerator_HumanoidRelative_Clamped.js
 */

import fs from 'fs';
import path from 'path';
import { NodeIO } from '@gltf-transform/core';

const io = new NodeIO();

const TOWN = process.argv[2] || 'town1';

const ROOT_DIR = path.join('assets', 'towns', TOWN);
const OUTPUT_MANIFEST = path.join(ROOT_DIR, 'assetsManifest.json');
const OUTPUT_SCALING = path.join(ROOT_DIR, 'scalingConfig.json');
const DEFAULTS_FILE = 'scalingDefaults.json';

const SUBFOLDERS = ['houses', 'trees', 'props'];

// Safe sanity clamp thresholds (in meters)
const MIN_HEIGHT = 0.1;
const MAX_HEIGHT = 50.0;

async function generateManifestAndScaling() {
    console.log(`[VRBox] Generating manifest + clamped scaling for town: ${TOWN}`);

    if (!fs.existsSync(DEFAULTS_FILE)) {
        throw new Error(`Missing ${DEFAULTS_FILE}. Please provide humanoidHeight and expected heights.`);
    }
    const defaults = JSON.parse(fs.readFileSync(DEFAULTS_FILE, 'utf-8'));
    const humanoidHeight = defaults.humanoidHeight || 2.0;

    const manifest = { houses: [], trees: [], props: [] };
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

        for (const file of files) {
            const relPath = `assets/towns/${TOWN}/${folder}/${file}`;
            manifest[folder].push(relPath);

            const modelPath = path.join(fullFolder, file);
            const document = await io.read(modelPath);

            let minY = Infinity;
            let maxY = -Infinity;
            let foundGeometry = false;

            const meshes = document.getRoot().listMeshes();
            for (const mesh of meshes) {
                for (const prim of mesh.listPrimitives()) {
                    const positionAccessor = prim.getAttribute('POSITION');
                    if (positionAccessor) {
                        const array = positionAccessor.getArray();
                        for (let i = 0; i < array.length; i += 3) {
                            const y = array[i + 1];
                            if (y < minY) minY = y;
                            if (y > maxY) maxY = y;
                        }
                        foundGeometry = true;
                    }
                }
            }

            let rawHeight = 1.0;
            if (foundGeometry && isFinite(minY) && isFinite(maxY)) {
                rawHeight = maxY - minY;
            } else {
                console.warn(`[VRBox] WARNING: No geometry found for ${relPath}, assuming height=1.0`);
            }

            // Apply clamping:
            if (rawHeight > MAX_HEIGHT) {
                console.warn(`[VRBox] WARNING: Raw height too large (${rawHeight.toFixed(2)}), clamping to ${MAX_HEIGHT}`);
                rawHeight = MAX_HEIGHT;
            }
            if (rawHeight < MIN_HEIGHT) {
                console.warn(`[VRBox] WARNING: Raw height too small (${rawHeight.toFixed(2)}), clamping to ${MIN_HEIGHT}`);
                rawHeight = MIN_HEIGHT;
            }

            // Core scaling formula: humanoid-relative normalization
            const scale = (humanoidHeight / expectedHeight) / rawHeight;
            const safeScale = parseFloat(scale.toFixed(3));

            scalingConfig[relPath] = safeScale;

            console.log(`[VRBox] ${relPath} | rawHeight=${rawHeight.toFixed(2)} | scale=${safeScale}`);
        }
    }

    fs.writeFileSync(OUTPUT_MANIFEST, JSON.stringify(manifest, null, 2));
    fs.writeFileSync(OUTPUT_SCALING, JSON.stringify(scalingConfig, null, 2));

    console.log(`[VRBox] Done!`);
}

generateManifestAndScaling();
