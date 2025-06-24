
/**
 * Purpose: Optimized streaming asset loader with scaling applied immediately.
 * Key features: Async batch loading, applies scalingConfig directly per asset.
 * Dependencies: sceneSetup.js, cameraSetup.js, scalingConfig.json, assetsManifest.json, GLTFLoader.js
 * MIT License: https://github.com/[new-repo-path]/LICENSE
 * Timestamp: 2025-06-22 16:20 | File: assetBasedTownBuilder.js
 */

import * as THREE from '../js/libs/three.module.min.js';
import { GLTFLoader } from '../js/libs/GLTFLoader.js';
import { scene } from './sceneSetup.js';

const loader = new GLTFLoader();

export async function generateTown(townName) {
    console.log(`[VRBox] Generating town: ${townName}`);

    const manifestPath = `assets/towns/${townName}/assetsManifest.json`;
    const scalingPath = `assets/towns/${townName}/scalingConfig.json`;

    const manifest = await fetchJSON(manifestPath);
    const scalingConfig = await fetchJSON(scalingPath);

    const allFiles = [...manifest.houses, ...manifest.trees, ...manifest.props];

    // Optional loading indicator
    const loadingDiv = createLoadingIndicator();

    for (let i = 0; i < allFiles.length; i++) {
        const modelPath = allFiles[i];
        await loadAndPlaceModel(modelPath, scalingConfig);
        updateLoadingIndicator(loadingDiv, i + 1, allFiles.length);
    }

    removeLoadingIndicator(loadingDiv);
    console.log(`[VRBox] Town generation complete`);
}

async function loadAndPlaceModel(modelPath, scalingConfig) {
    return new Promise((resolve, reject) => {
        loader.load(modelPath, (gltf) => {
            const model = gltf.scene;
            const scale = scalingConfig[modelPath] || 1.0;
            model.scale.setScalar(scale);

            // Optional: Randomize placement for testing
            model.position.x = (Math.random() - 0.5) * 100;
            model.position.z = (Math.random() - 0.5) * 100;
            model.position.y = 0;

            scene.add(model);
            resolve();
        }, undefined, (err) => {
            console.error(`[VRBox] Failed to load ${modelPath}`, err);
            resolve(); // Fail-safe: skip asset but continue loading
        });
    });
}

async function fetchJSON(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`[VRBox] Failed to fetch ${url}`);
    }
    return response.json();
}

// Simple loading indicator
function createLoadingIndicator() {
    const div = document.createElement('div');
    div.id = 'loading-indicator';
    div.style.position = 'absolute';
    div.style.top = '50%';
    div.style.left = '50%';
    div.style.transform = 'translate(-50%, -50%)';
    div.style.padding = '20px';
    div.style.background = 'rgba(0,0,0,0.7)';
    div.style.color = 'white';
    div.style.fontSize = '24px';
    div.style.borderRadius = '10px';
    div.innerText = 'Loading town...';
    document.body.appendChild(div);
    return div;
}

function updateLoadingIndicator(div, loaded, total) {
    div.innerText = `Loading ${loaded} / ${total}`;
}

function removeLoadingIndicator(div) {
    if (div && div.parentNode) {
        div.parentNode.removeChild(div);
    }
}
