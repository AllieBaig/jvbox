
/**
 * Purpose: Camera setup for VRBox v10 using Summer Afternoon style composition.
 * Key features: Fixed distance, locked zoom, smooth auto-rotation for immersive feel.
 * Dependencies: three.module.min.js, OrbitControls.js
 * Related helpers: sceneSetup.js (imports this)
 * Function names: createCamera(), createControls()
 * MIT License: https://github.com/[new-repo-path]/LICENSE
 * Timestamp: 2025-06-22 14:00 | File: js/cameraSetup.js
 */

import * as THREE from '../libs/three.module.min.js';
import { OrbitControls } from '../libs/OrbitControls.js';

export let camera, controls;

export function createCamera(renderer) {
    // Use slightly wide FOV like Summer Afternoon
    camera = new THREE.PerspectiveCamera(
        50,                                // FOV
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    // Pull camera far back and elevated
    camera.position.set(80, 60, 80);
    camera.lookAt(0, 0, 0);

    return camera;
}

export function createControls(renderer) {
    controls = new OrbitControls(camera, renderer.domElement);

    // Disable zoom completely (or restrict zoom range)
    controls.enableZoom = false;
    // Optional: if you want zoom limit instead of full disable:
    // controls.minDistance = 40;
    // controls.maxDistance = 40;

    // Add gentle auto-rotation for lively scene
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.4;

    // Smooth pan restrictions
    controls.enablePan = false;
}
