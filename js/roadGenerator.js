

/**
 * Purpose: Generate simple procedural road grid.
 * Key features: Creates flat plane roads as gridlines.
 * Dependencies: three.js
 * Function names: generateRoadGrid()
 * MIT License: https://github.com/[new-repo-path]/LICENSE
 * Timestamp: 2025-06-25 12:45 | File: js/roadGenerator.js
 */

import * as THREE from './libs/three.module.min.js';

export function generateRoadGrid(scene, gridSize = 50, cellSize = 10) {
    const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });

    // Create roads along X axis
    for (let x = -gridSize / 2; x <= gridSize / 2; x += cellSize) {
        const roadGeometry = new THREE.BoxGeometry(1, 0.1, gridSize);
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.position.set(x, 0, 0);
        scene.add(road);
    }

    // Create roads along Z axis
    for (let z = -gridSize / 2; z <= gridSize / 2; z += cellSize) {
        const roadGeometry = new THREE.BoxGeometry(gridSize, 0.1, 1);
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.position.set(0, 0, z);
        scene.add(road);
    }

    console.log('[VRBox] Road grid generated.');
}

