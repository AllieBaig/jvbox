
/**
 * Purpose: Main entry point for VRBox v10 sandbox with velocity-based smooth movement.
 * Key features: Scene setup, world generation, modular initialization, deltaTime-based movement.
 * Dependencies: sceneSetup.js, townBuilder.js, controls.js, joystickControls.js, humanoid.js, recorder.js
 * Related helpers: all modules
 * Function names: init(), animate(), mergeControlState()
 * MIT License: https://github.com/[new-repo-path]/LICENSE
 * Timestamp: 2025-06-22 11:40 | File: js/main.js
 */

import { setupScene, scene, camera, renderer } from './sceneSetup.js';
import { generateTown } from './assetBasedTownBuilder.js';
import { setupControls, keyboardState } from './controls.js';
import { setupJoystick, joystickState } from './joystickControls.js';
import { createHumanoid, humanoid } from './humanoid.js';
import { setupRecorder, recorder } from './recorder.js';

function init() {
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

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function mergeControlState() {
    return {
        forward: keyboardState.forward || joystickState.forward,
        backward: keyboardState.backward || joystickState.backward,
        left: keyboardState.left || joystickState.left,
        right: keyboardState.right || joystickState.right
    };
}

let lastTime = performance.now();

function animate() {
    requestAnimationFrame(animate);

    const now = performance.now();
    const deltaTime = (now - lastTime) / 1000; // in seconds
    lastTime = now;

    const controlState = mergeControlState();
    humanoid.update(controlState, deltaTime);
    recorder.recordStep(controlState);

    renderer.render(scene, camera);
}

init();
