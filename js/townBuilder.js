
/**
 * Purpose: Stylized low-poly town generator with house-like buildings for VRBox v10.
 * Key features: Houses with roofs, mixed block types, clean flat colors, iOS-friendly.
 * Dependencies: sceneSetup.js (scene), three.module.min.js
 * Related helpers: main.js, humanoid.js
 * Function names: generateTown()
 * MIT License: https://github.com/[new-repo-path]/LICENSE
 * Timestamp: 2025-06-22 10:55 | File: js/townBuilder.js
 */

import * as THREE from '../js/libs/three.module.min.js';
import { scene } from './sceneSetup.js';

export function generateTown() {
    console.log("[VRBox] Generating upgraded town...");

    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xa0d080 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
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
                addHouse(centerX, centerZ);
            } else if (rand < 0.8) {
                addTree(centerX, centerZ);
            } else {
                addStreet(centerX, centerZ);
            }
        }
    }

    console.log("[VRBox] Town generation complete.");
}

function addHouse(x, z) {
    // Base house body
    const width = 2 + Math.random() * 1.5;
    const depth = 2 + Math.random() * 1.5;
    const height = 2 + Math.random() * 2;

    const baseGeometry = new THREE.BoxGeometry(width, height, depth);
    const colorPalette = [0xffd580, 0xff9999, 0x8fd3f4, 0xb2f7ef, 0xd5a6bd];
    const baseMaterial = new THREE.MeshStandardMaterial({
        color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
        flatShading: true
    });

    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.set(x, height / 2, z);
    scene.add(base);

    // Add roof
    const roofHeight = 1 + Math.random();
    const roofGeometry = new THREE.ConeGeometry(Math.max(width, depth) * 0.6, roofHeight, 4);
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x8b0000, flatShading: true });

    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.rotation.y = Math.PI / 4; // make it pointy like house roof
    roof.position.set(x, height + (roofHeight / 2), z);
    scene.add(roof);
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
