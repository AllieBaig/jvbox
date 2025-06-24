

/**
 * Purpose: TownPacker — combine full town into one optimized glb file for fast loading.
 * Key features: Loads assetsManifest + scalingConfig, applies scaling, combines all into single glb.
 * Dependencies: @gltf-transform/core v4.x
 * MIT License: https://github.com/[new-repo-path]/LICENSE
 * Timestamp: 2025-06-22 17:30 | File: TownPacker.js
 */

import fs from 'fs';
import path from 'path';
import { NodeIO, vec3, mat4, Scene } from '@gltf-transform/core';
import { Transform, logger } from '@gltf-transform/core';

const io = new NodeIO();

const TOWN = process.argv[2] || 'town1';
const ROOT_DIR = path.join('assets', 'towns', TOWN);
const MANIFEST_FILE = path.join(ROOT_DIR, 'assetsManifest.json');
const SCALING_FILE = path.join(ROOT_DIR, 'scalingConfig.json');
const OUTPUT_FILE = path.join(ROOT_DIR, 'packedTown.glb');

const SUBFOLDERS = ['houses', 'trees', 'props'];

async function packTown() {
    console.log(`[VRBox] Packing full town: ${TOWN}`);

    const manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf-8'));
    const scalingConfig = JSON.parse(fs.readFileSync(SCALING_FILE, 'utf-8'));

    const packedDocument = io.createDocument();
    const packedScene = packedDocument.createScene('PackedTown');

    for (const folder of SUBFOLDERS) {
        const files = manifest[folder] || [];

        for (const relPath of files) {
            const absolutePath = path.join(relPath);
            console.log(`[VRBox] Packing: ${relPath}`);

            const doc = await io.read(absolutePath);
            const scene = doc.getRoot().getDefaultScene();
            if (!scene) {
                console.warn(`[VRBox] No scene in ${relPath}, skipping.`);
                continue;
            }

            const scale = scalingConfig[relPath] || 1.0;

            for (const node of scene.listChildren()) {
                const clonedNode = node.clone();
                const transform = mat4.fromScaling(mat4.create(), vec3.fromValues(scale, scale, scale));
                clonedNode.setMatrix(transform);

                // Optional: randomize placement for packing demonstration
                const offsetX = (Math.random() - 0.5) * 100;
                const offsetZ = (Math.random() - 0.5) * 100;
                clonedNode.setTranslation([offsetX, 0, offsetZ]);

                packedScene.addChild(clonedNode);
            }
        }
    }

    await io.write(OUTPUT_FILE, packedDocument);
    console.log(`[VRBox] Town packed to: ${OUTPUT_FILE}`);
}

packTown();

