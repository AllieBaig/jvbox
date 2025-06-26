
/**
 * Purpose: Create and update a simple humanoid placeholder for VRBox v10.
 * Key features: Basic box model, movement updates based on control state.
 * Dependencies: sceneSetup.js (scene)
 * Related helpers: main.js (calls humanoid.update()), controls.js, joystickControls.js
 * Function names: createHumanoid(), update()
 * MIT License: https://github.com/[new-repo-path]/LICENSE
 * Timestamp: 2025-06-22 10:20 | File: js/humanoid.js
 */

import * as THREE from '../js/libs/three.module.min.js';
import { scene } from './sceneSetup.js';

export let humanoid = null;

export function createHumanoid() {
    console.log("[VRBox] Creating humanoid...");

    const geometry = new THREE.BoxGeometry(1, 2, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    humanoid = new THREE.Mesh(geometry, material);
    humanoid.position.set(0, 1, 0); // center on ground

    scene.add(humanoid);

    humanoid.update = function (controlState) {
        const speed = 0.1;

        if (controlState.forward) humanoid.position.z -= speed;
        if (controlState.backward) humanoid.position.z += speed;
        if (controlState.left) humanoid.position.x -= speed;
        if (controlState.right) humanoid.position.x += speed;
    };

    console.log("[VRBox] Humanoid ready.");
}
