
/**
 * Purpose: Simplified VRBox v10 main entry with hardcoded town selector for dev testing.
 * Key features: Fixed town loading, asset procedural generation, velocity-based movement, frame-rate independent.
 * Dependencies: sceneSetup.js, assetBasedTownBuilder.js, controls.js, joystickControls.js, humanoid.js, recorder.js
 * Related helpers: all modules
 * Function names: init(), animate(), mergeControlState()
 * MIT License: https://github.com/[new-repo-path]/LICENSE
 * Timestamp: 2025-06-22 12:40 | File: js/main.js
 */

import { setupScene, scene, camera, renderer } from './sceneSetup.js';
import { generateTown } from './assetBasedTownBuilder.js';
import { setupControls, keyboardState } from './controls.js';
import { setupJoystick, joystickState } from './joystickControls.js';
import { createHumanoid, humanoid } from './humanoid.js';
import { setupRecorder, recorder } from './recorder.js';

// Hardcoded town for testing
const ACTIVE_TOWN = 'town1';

async function init() {
    console.log("[VRBox] Initialization started.");

    setupScene();
    await generateTown(ACTIVE_TOWN);
    setupControls();
    setupJoystick();
    createHumanoid();
    setupRecorder();

    window.addEventListener('resize', onWindowResize);
    animate();

    console.log(`[VRBox] Loaded Town: ${ACTIVE_TOWN}`);
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
