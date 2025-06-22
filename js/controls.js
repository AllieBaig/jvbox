
/**
 * Purpose: Handle keyboard-based movement controls for VRBox v10.
 * Key features: WASD and Arrow key support, real-time state tracking.
 * Dependencies: None
 * Related helpers: main.js (mergeControlState), joystickControls.js
 * Function names: setupControls(), keyboardState (object)
 * MIT License: https://github.com/[new-repo-path]/LICENSE
 * Timestamp: 2025-06-22 10:10 | File: js/controls.js
 */

export const keyboardState = {
    forward: false,
    backward: false,
    left: false,
    right: false
};

export function setupControls() {
    console.log("[VRBox] Setting up keyboard controls...");

    window.addEventListener('keydown', (event) => {
        switch (event.code) {
            case 'KeyW':
            case 'ArrowUp':
                keyboardState.forward = true;
                break;
            case 'KeyS':
            case 'ArrowDown':
                keyboardState.backward = true;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                keyboardState.left = true;
                break;
            case 'KeyD':
            case 'ArrowRight':
                keyboardState.right = true;
                break;
        }
    });

    window.addEventListener('keyup', (event) => {
        switch (event.code) {
            case 'KeyW':
            case 'ArrowUp':
                keyboardState.forward = false;
                break;
            case 'KeyS':
            case 'ArrowDown':
                keyboardState.backward = false;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                keyboardState.left = false;
                break;
            case 'KeyD':
            case 'ArrowRight':
                keyboardState.right = false;
                break;
        }
    });

    console.log("[VRBox] Keyboard controls ready.");
}
