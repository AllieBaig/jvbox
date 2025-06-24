
/**
 * Purpose: Full asset-based procedural town builder with per-asset scaling for VRBox v10.
 * Key features: Reads assetsManifest.json and scalingConfig.json for active town.
 * Dependencies: sceneSetup.js, three.module.min.js, GLTFLoader.js
 * Related helpers: main.js
 * Function names: generateTown()
 * MIT License: https://github.com/[new-repo-path]/LICENSE
 * Timestamp: 2025-06-22 13:30 | File: js/assetBasedTownBuilder.js
 */

import * as THREE from '../js/libs/three.module.min.js';
import { GLTFLoader } from '../js/libs/GLTFLoader.js';
import { scene } from './sceneSetup.js';

const loader = new GLTFLoader();

let manifest = null;
let scalingConfig = {};

export async function generateTown(activeTown) {
    console.log(`[VRBox] Loading manifest for ${activeTown}...`);
    manifest = await loadManifest(activeTown);
    scalingConfig = await loadScalingConfig(activeTown);

    console.log("[VRBox] Generating town...");

    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xa0d080 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const gridSize = 20;
    const blockSpacing = 10;

    for (let i = -gridSize / 2; i < gridSize / 2; i++) {
        for (let j = -gridSize / 2; j < gridSize / 2; j++) {
            const centerX = i * blockSpacing;
            const centerZ = j * blockSpacing;

            const rand = Math.random();

            if (rand < 0.5) {
                await addRandomAsset(manifest.houses, centerX, centerZ);
            } else if (rand < 0.8) {
                await addRandomAsset(manifest.trees, centerX, centerZ);
            } else {
                addStreet(centerX, centerZ);
            }
        }
    }
}

function loadManifest(town) {
    const path = `assets/towns/${town}/assetsManifest.json`;
    return fetch(path)
        .then(response => response.json())
        .catch(err => {
            console.error("[VRBox] Failed to load manifest:", err);
            return { houses: [], trees: [], props: [] };
        });
}

function loadScalingConfig(town) {
    const path = `assets/towns/${town}/scalingConfig.json`;
    return fetch(path)
        .then(response => response.json())
        .catch(err => {
            console.warn("[VRBox] No scalingConfig found, using defaults.");
            return {};
        });
}

function addRandomAsset(assetArray, x, z) {
    return new Promise((resolve, reject) => {
        if (assetArray.length === 0) return resolve();

        const path = assetArray[Math.floor(Math.random() * assetArray.length)];

        loader.load(path, (gltf) => {
            const model = gltf.scene;

            // Random placement within block
            model.position.set(
                x + (Math.random() - 0.5) * 2,
                0,
                z + (Math.random() - 0.5) * 2
            );
            model.rotation.y = Math.random() * Math.PI * 2;

            // Apply per-asset scaling
            const scale = scalingConfig[path] || 0.2; // Default fallback scale
            model.scale.setScalar(scale);

            scene.add(model);
            resolve();
        }, undefined, (err) => {
            console.error("[VRBox] GLTF load error:", err);
            resolve();
        });
    });
}

function addStreet(x, z) {
    const geometry = new THREE.PlaneGeometry(8, 8);
    const material = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const street = new THREE.Mesh(geometry, material);
    street.rotation.x = -Math.PI / 2;
    street.position.set(x, 0.01, z);
    scene.add(street);
}
