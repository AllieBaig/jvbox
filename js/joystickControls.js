
/**
 * Purpose: Handle on-screen joystick controls using nipplejs for VRBox v10.
 * Key features: Virtual joystick state management, real-time direction tracking.
 * Dependencies: nipplejs.module.js
 * Related helpers: main.js (mergeControlState), controls.js
 * Function names: setupJoystick(), joystickState (object)
 * MIT License: https://github.com/[new-repo-path]/LICENSE
 * Timestamp: 2025-06-22 10:15 | File: js/joystickControls.js
 */

import nipplejs from '../js/libs/nipplejs.module.js';

export const joystickState = {
    forward: false,
    backward: false,
    left: false,
    right: false
};

let joystick;

export function setupJoystick() {
    console.log("[VRBox] Setting up joystick...");

    const container = document.getElementById('joystickContainer');
    joystick = nipplejs.create({
        zone: container,
        mode: 'static',
        position: { left: '50%', top: '50%' },
        color: 'white',
        size: 100
    });

    joystick.on('move', (evt, data) => {
        const angle = data.angle.degree;

        joystickState.forward = (angle >= 45 && angle <= 135);
        joystickState.backward = (angle >= 225 && angle <= 315);
        joystickState.left = (angle > 135 && angle < 225);
        joystickState.right = (angle < 45 || angle > 315);
    });

    joystick.on('end', () => {
        joystickState.forward = false;
        joystickState.backward = false;
        joystickState.left = false;
        joystickState.right = false;
    });

    console.log("[VRBox] Joystick ready.");
}
