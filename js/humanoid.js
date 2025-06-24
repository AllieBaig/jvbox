
/**
 * Purpose: Create and update humanoid with velocity-based smooth movement for VRBox v10.
 * Key features: Continuous acceleration/deceleration, smooth rotation, RL-compatible state.
 * Dependencies: sceneSetup.js (scene), three.module.min.js
 * Related helpers: main.js (calls humanoid.update()), controls.js, joystickControls.js
 * Function names: createHumanoid(), update()
 * MIT License: https://github.com/[new-repo-path]/LICENSE
 * Timestamp: 2025-06-22 11:30 | File: js/humanoid.js
 */

import * as THREE from '../js/libs/three.module.min.js';
import { scene } from './sceneSetup.js';

export let humanoid = null;

export function createHumanoid() {
    console.log("[VRBox] Creating humanoid with velocity-based movement...");

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

    // Legs
    const legGeometry = new THREE.BoxGeometry(0.3, 1, 0.3);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, flatShading: true });
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.25, 0.5, 0);
    humanoid.add(leftLeg);

    const rightLeg = leftLeg.clone();
    rightLeg.position.set(0.25, 0.5, 0);
    humanoid.add(rightLeg);

    humanoid.position.set(0, 0, 0);
    scene.add(humanoid);

    // Internal velocity state
    humanoid.velocity = new THREE.Vector3(0, 0, 0);
    humanoid.targetDirection = new THREE.Vector3();
    humanoid.rotationSmooth = 0;

    // Public update function
    humanoid.update = function (controlState, deltaTime = 1/60) {
        let moveX = 0;
        let moveZ = 0;

        if (controlState.forward) moveZ -= 1;
        if (controlState.backward) moveZ += 1;
        if (controlState.left) moveX -= 1;
        if (controlState.right) moveX += 1;

        // Calculate target direction
        this.targetDirection.set(moveX, 0, moveZ);
        if (this.targetDirection.length() > 0) {
            this.targetDirection.normalize().multiplyScalar(2.0); // desired speed units
        } else {
            this.targetDirection.set(0, 0, 0);
        }

        // Smooth velocity towards target
        this.velocity.lerp(this.targetDirection, 0.15);

        // Update position
        this.position.addScaledVector(this.velocity, deltaTime);

        // Smooth rotation to face movement
        if (this.velocity.length() > 0.05) {
            const angle = Math.atan2(this.velocity.x, this.velocity.z);
            this.rotationSmooth += (angle - this.rotationSmooth) * 0.15;
            this.rotation.y = this.rotationSmooth;
        }
    };

    console.log("[VRBox] Humanoid ready with velocity-based movement.");
}
