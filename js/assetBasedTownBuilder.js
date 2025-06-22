
/**
 * Purpose: Asset-based procedural town generator for VRBox v10.
 * Key features: Uses external GLTF models placed procedurally on grid system.
 * Dependencies: sceneSetup.js (scene), three.module.min.js, GLTFLoader.js
 * Related helpers: main.js
 * Function names: generateTown(), loadGLTF(), addRandomAsset()
 * MIT License: https://github.com/[new-repo-path]/LICENSE
 * Timestamp: 2025-06-22 11:10 | File: js/assetBasedTownBuilder.js
 */

import * as THREE from '../js/libs/three.module.min.js';
import { GLTFLoader } from '../js/libs/GLTFLoader.js';
import { scene } from './sceneSetup.js';

const loader = new GLTFLoader();

// Define available assets
const houseAssets = [
    'assets/models/houses/house1.glb',
    'assets/models/houses/house2.glb',
    'assets/models/houses/house3.glb'
];

const treeAssets = [
    'assets/models/trees/tree1.glb',
    'assets/models/trees/tree2.glb'
];

export function generateTown() {
    console.log("[VRBox] Generating asset-based town...");

    // Flat ground plane
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xa0d080 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // Grid system
    const gridSize = 20;
    const blockSpacing = 10;

    for (let i = -gridSize / 2; i < gridSize / 2; i++) {
        for (let j = -gridSize / 2; j < gridSize / 2; j++) {
            const centerX = i * blockSpacing;
            const centerZ = j * blockSpacing;

            const rand = Math.random();

            if (rand < 0.5) {
                addRandomAsset(houseAssets, centerX, centerZ);
            } else if (rand < 0.8) {
                addRandomAsset(treeAssets, centerX, centerZ);
            } else {
                addStreet(centerX, centerZ);
            }
        }
    }
}

function addRandomAsset(assetArray, x, z) {
    const modelPath = assetArray[Math.floor(Math.random() * assetArray.length)];
    loadGLTF(modelPath, x, z);
}

function loadGLTF(path, x, z) {
    loader.load(path, (gltf) => {
        const model = gltf.scene;
        model.position.set(
            x + (Math.random() - 0.5) * 2,
            0,
            z + (Math.random() - 0.5) * 2
        );
        model.rotation.y = Math.random() * Math.PI * 2;
        model.scale.setScalar(1); // scale adjustment if needed

        scene.add(model);
    }, undefined, (error) => {
        console.error('[VRBox] GLTF load error:', error);
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
