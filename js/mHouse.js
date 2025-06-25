

/**
 * Purpose: Manually builds a stylized house using only Three.js primitives (no GLB).
 * Features: Base, roof, chimney, door, windows, bushes, flowers, stones.
 * Used by: main.js
 * Related files: houseSpawner.js (GLB-based), colorRandomizer.js
 * Special notes: No external 3D models required. All procedural.
 * MIT License: https://github.com/jvbox/LICENSE
 * Timestamp: 2025-06-25 20:55 | File: js/manualHouseBuilder.js
 */

import * as THREE from './libs/three.module.min.js';

export function createManualHouse() {
    const house = new THREE.Group();

    // Base
    const baseGeo = new THREE.BoxGeometry(8, 4, 6);
    const baseMat = new THREE.MeshLambertMaterial({ color: 0xF5DEB3 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 2;
    base.castShadow = base.receiveShadow = true;
    house.add(base);

    // Roof
    const roofGeo = new THREE.ConeGeometry(6, 3, 4);
    const roofMat = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 5.5;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    house.add(roof);

    // Door
    const door = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 2.5, 0.1),
        new THREE.MeshLambertMaterial({ color: 0x654321 })
    );
    door.position.set(0, 1.25, 3.05);
    house.add(door);

    // Handle
    const handle = new THREE.Mesh(
        new THREE.SphereGeometry(0.05),
        new THREE.MeshLambertMaterial({ color: 0xFFD700 })
    );
    handle.position.set(0.6, 1.25, 3.1);
    house.add(handle);

    // Windows
    const winGeo = new THREE.BoxGeometry(1.2, 1.2, 0.1);
    const winMat = new THREE.MeshLambertMaterial({ color: 0x87CEEB });

    const frontWinL = new THREE.Mesh(winGeo, winMat);
    frontWinL.position.set(-2, 2.5, 3.05);
    house.add(frontWinL);

    const frontWinR = new THREE.Mesh(winGeo, winMat);
    frontWinR.position.set(2, 2.5, 3.05);
    house.add(frontWinR);

    const sideWinL = new THREE.Mesh(winGeo, winMat);
    sideWinL.position.set(-4.05, 2.5, 1);
    house.add(sideWinL);

    const sideWinR = new THREE.Mesh(winGeo, winMat);
    sideWinR.position.set(4.05, 2.5, 1);
    house.add(sideWinR);

    // Chimney
    const chimney = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 2, 0.8),
        new THREE.MeshLambertMaterial({ color: 0x696969 })
    );
    chimney.position.set(2.5, 5.5, 1);
    chimney.castShadow = true;
    house.add(chimney);

    return house;
}

