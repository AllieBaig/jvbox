

/**
 * Purpose: Generate simple low-poly humanoid for VRBox sandbox.
 * Key features: Pure procedural model, low-poly, fully iOS/mobile-safe, no external files.
 * Dependencies: three.module.min.js
 * Related helpers: sceneSetup.js
 * Function names: createCuteHumanoid()
 * MIT License: https://github.com/[new-repo-path]/LICENSE
 * Timestamp: 2025-06-22 17:20 | File: js/cuteLowPolyHumanoid.js
 */

import * as THREE from '../js/libs/three.module.min.js';
import { scene } from './sceneSetup.js';

export function createCuteHumanoid(position = {x: 0, y: 0, z: 0}) {
    const humanoid = new THREE.Group();

    // Body
    const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1.2, 6);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xffcc99 });
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    bodyMesh.position.y = 0.6;
    humanoid.add(bodyMesh);

    // Head
    const headGeometry = new THREE.SphereGeometry(0.3, 8, 8);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffeecc });
    const headMesh = new THREE.Mesh(headGeometry, headMaterial);
    headMesh.position.y = 1.4;
    humanoid.add(headMesh);

    // Simple eyes (black circles)
    const eyeGeometry = new THREE.CircleGeometry(0.05, 6);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });

    const eyeLeft = new THREE.Mesh(eyeGeometry, eyeMaterial);
    eyeLeft.position.set(-0.1, 1.5, 0.29);
    eyeLeft.rotation.y = Math.PI;

    const eyeRight = eyeLeft.clone();
    eyeRight.position.x = 0.1;

    humanoid.add(eyeLeft);
    humanoid.add(eyeRight);

    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 6);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });

    const legLeft = new THREE.Mesh(legGeometry, legMaterial);
    legLeft.position.set(-0.15, 0.3, 0);
    humanoid.add(legLeft);

    const legRight = legLeft.clone();
    legRight.position.x = 0.15;
    humanoid.add(legRight);

    // Arms
    const armGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 6);
    const armMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });

    const armLeft = new THREE.Mesh(armGeometry, armMaterial);
    armLeft.position.set(-0.35, 0.9, 0);
    armLeft.rotation.z = Math.PI / 4;
    humanoid.add(armLeft);

    const armRight = armLeft.clone();
    armRight.position.x = 0.35;
    armRight.rotation.z = -Math.PI / 4;
    humanoid.add(armRight);

    // Position in scene
    humanoid.position.set(position.x, position.y, position.z);
    scene.add(humanoid);

    return humanoid;
}

