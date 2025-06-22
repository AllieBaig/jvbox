
/**
 * Purpose: Stylized low-poly town generator inspired by Infinitown for VRBox v10.
 * Key features: Procedural grid-based block placement, simple low-poly buildings, trees, streets.
 * Dependencies: sceneSetup.js (scene), three.module.min.js
 * Related helpers: main.js, humanoid.js
 * Function names: generateTown()
 * MIT License: https://github.com/[new-repo-path]/LICENSE
 * Timestamp: 2025-06-22 10:40 | File: js/townBuilder.js
 */

import * as THREE from '../js/libs/three.module.min.js';
import { scene } from './sceneSetup.js';

export function generateTown() {
    console.log("[VRBox] Generating stylized town...");

    // Ground plane (light green grass)
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xa0d080 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grid system for town blocks
    const gridSize = 20;
    const blockSpacing = 10;

    for (let i = -gridSize/2; i < gridSize/2; i++) {
        for (let j = -gridSize/2; j < gridSize/2; j++) {

            const centerX = i * blockSpacing;
            const centerZ = j * blockSpacing;

            // Randomly decide block type
            const rand = Math.random();

            if (rand < 0.6) {
                addBuilding(centerX, centerZ);
            } else if (rand < 0.85) {
                addTree(centerX, centerZ);
            } else {
                addStreet(centerX, centerZ);
            }
        }
    }

    console.log("[VRBox] Town generation complete.");
}

function addBuilding(x, z) {
    const width = 2 + Math.random() * 2;
    const depth = 2 + Math.random() * 2;
    const height = 4 + Math.random() * 8;

    const geometry = new THREE.BoxGeometry(width, height, depth);
    const colorPalette = [0xf2b134, 0x8e44ad, 0xe74c3c, 0x3498db, 0x2ecc71];
    const material = new THREE.MeshStandardMaterial({
        color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
        flatShading: true
    });

    const building = new THREE.Mesh(geometry, material);
    building.position.set(
        x + (Math.random() - 0.5) * 2,
        height / 2,
        z + (Math.random() - 0.5) * 2
    );
    scene.add(building);
}

function addTree(x, z) {
    const trunkGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1);
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8b5a2b });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 0.5;

    const crownGeometry = new THREE.DodecahedronGeometry(0.7);
    const crownMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22, flatShading: true });
    const crown = new THREE.Mesh(crownGeometry, crownMaterial);
    crown.position.y = 1.4;

    const group = new THREE.Group();
    group.add(trunk);
    group.add(crown);
    group.position.set(
        x + (Math.random() - 0.5) * 2,
        0,
        z + (Math.random() - 0.5) * 2
    );
    scene.add(group);
}

function addStreet(x, z) {
    const geometry = new THREE.PlaneGeometry(8, 8);
    const material = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const street = new THREE.Mesh(geometry, material);
    street.rotation.x = -Math.PI / 2;
    street.position.set(x, 0.01, z);
    scene.add(street);
}
