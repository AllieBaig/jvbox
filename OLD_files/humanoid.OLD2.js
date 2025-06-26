
/**
 * Purpose: Create and update a simple low-poly humanoid for VRBox v10.
 * Key features: Procedural multi-part humanoid, head + body + legs, fully mobile-friendly.
 * Dependencies: sceneSetup.js (scene), three.module.min.js
 * Related helpers: main.js (calls humanoid.update()), controls.js, joystickControls.js
 * Function names: createHumanoid(), update()
 * MIT License: https://github.com/[new-repo-path]/LICENSE
 * Timestamp: 2025-06-22 11:00 | File: js/humanoid.js
 */

import * as THREE from '../js/libs/three.module.min.js';
import { scene } from './sceneSetup.js';

export let humanoid = null;

export function createHumanoid() {
    console.log("[VRBox] Creating simple 3D humanoid...");

    humanoid = new THREE.Group();

    // Torso
    const torsoGeometry = new THREE.BoxGeometry(1, 1.5, 0.6);
    const torsoMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff88, flatShading: true });
    const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
    torso.position.y = 1.25;
    humanoid.add(torso);

    // Head
    const headGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffcc00, flatShading: true });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 2.3;
    humanoid.add(head);

    // Left Leg
    const leftLegGeometry = new THREE.BoxGeometry(0.3, 1, 0.3);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, flatShading: true });
    const leftLeg = new THREE.Mesh(leftLegGeometry, legMaterial);
    leftLeg.position.set(-0.25, 0.5, 0);
    humanoid.add(leftLeg);

    // Right Leg
    const rightLeg = leftLeg.clone();
    rightLeg.position.set(0.25, 0.5, 0);
    humanoid.add(rightLeg);

    humanoid.position.set(0, 0, 0);
    scene.add(humanoid);

    humanoid.update = function (controlState) {
        const speed = 0.1;

        if (controlState.forward) this.position.z -= speed;
        if (controlState.backward) this.position.z += speed;
        if (controlState.left) this.position.x -= speed;
        if (controlState.right) this.position.x += speed;
    };

    console.log("[VRBox] Humanoid ready.");
}
