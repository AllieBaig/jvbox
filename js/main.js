
/**
 * Purpose: Main entry point for VRBox v10 sandbox application.
 * Key features: Scene setup, rendering loop, control state merging, modular initialization.
 * Dependencies: sceneSetup.js, controls.js, joystickControls.js, humanoid.js, recorder.js
 * Related helpers: mode merging happens here; joystick and keyboard inputs combined.
 * Function names: init(), animate(), mergeControlState()
 * MIT License: https://github.com/[new-repo-path]/LICENSE
 * Timestamp: 2025-06-22 10:00 | File: js/main.js
 */

import { setupScene, scene, camera, renderer } from './sceneSetup.js';
import { generateTown } from './townBuilder.js';

import { setupControls, keyboardState } from './controls.js';
import { setupJoystick, joystickState } from './joystickControls.js';
import { createHumanoid, humanoid } from './humanoid.js';
import { setupRecorder, recorder } from './recorder.js';

// Initialize full app
async function init() {
    console.log("[VRBox] Initialization started.");

    setupScene();
    generateTown();
    setupControls();
    setupJoystick();
    createHumanoid();
    setupRecorder();

    window.addEventListener('resize', onWindowResize);
    animate();

    console.log("[VRBox] Initialization completed.");
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Merge control states (keyboard + joystick)
function mergeControlState() {
    const merged = {
        forward: keyboardState.forward || joystickState.forward,
        backward: keyboardState.backward || joystickState.backward,
        left: keyboardState.left || joystickState.left,
        right: keyboardState.right || joystickState.right
    };
    return merged;
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    const controlState = mergeControlState();
    humanoid.update(controlState);
    recorder.recordStep(controlState);

    renderer.render(scene, camera);
}

// Start
init();
