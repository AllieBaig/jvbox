

/**
 * Purpose: Procedural humanoid spawner system for VRBox v10 sandbox.
 * Key features: Spawns multiple humanoids with idle, walking, sitting behaviors.
 * Dependencies: sceneSetup.js, three.module.min.js
 * Related helpers: assetBasedTownBuilder.js
 * Function names: spawnPopulation(), updatePopulation()
 * MIT License: https://github.com/[new-repo-path]/LICENSE
 * Timestamp: 2025-06-22 13:00 | File: js/humanoidSpawner.js
 */

import * as THREE from '../libs/three.module.min.js';
import { scene } from './sceneSetup.js';

export let humanoidPopulation = [];

export function spawnPopulation() {
    console.log("[VRBox] Spawning population...");

    // You can easily tweak these numbers
    const numWalkers = 10;
    const numSitters = 5;
    const numIdlers = 8;

    // Generate walkers
    for (let i = 0; i < numWalkers; i++) {
        humanoidPopulation.push(createHumanoid('walker'));
    }

    // Generate sitters
    for (let i = 0; i < numSitters; i++) {
        humanoidPopulation.push(createHumanoid('sitter'));
    }

    // Generate idlers
    for (let i = 0; i < numIdlers; i++) {
        humanoidPopulation.push(createHumanoid('idler'));
    }
}

function createHumanoid(behavior) {
    const humanoid = new THREE.Group();

    const torsoGeometry = new THREE.BoxGeometry(0.6, 1.2, 0.4);
    const torsoMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffaa });
    const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
    torso.position.y = 1;
    humanoid.add(torso);

    const headGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffcc00 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.8;
    humanoid.add(head);

    humanoid.position.set(
        (Math.random() - 0.5) * 80,
        0,
        (Math.random() - 0.5) * 80
    );

    humanoid.behavior = behavior;
    humanoid.target = new THREE.Vector3();
    humanoid.velocity = new THREE.Vector3();
    humanoid.rotationSmooth = 0;

    if (behavior === 'walker') {
        assignNewTarget(humanoid);
    }

    scene.add(humanoid);
    return humanoid;
}

function assignNewTarget(humanoid) {
    humanoid.target.set(
        humanoid.position.x + (Math.random() - 0.5) * 40,
        0,
        humanoid.position.z + (Math.random() - 0.5) * 40
    );
}

export function updatePopulation(deltaTime) {
    humanoidPopulation.forEach(humanoid => {
        if (humanoid.behavior === 'walker') {
            // Move towards target
            const direction = new THREE.Vector3().subVectors(humanoid.target, humanoid.position);
            const distance = direction.length();
            if (distance > 1) {
                direction.normalize();
                humanoid.velocity.lerp(direction.multiplyScalar(1.5), 0.1);
                humanoid.position.addScaledVector(humanoid.velocity, deltaTime);

                const angle = Math.atan2(humanoid.velocity.x, humanoid.velocity.z);
                humanoid.rotationSmooth += (angle - humanoid.rotationSmooth) * 0.1;
                humanoid.rotation.y = humanoid.rotationSmooth;
            } else {
                assignNewTarget(humanoid);
            }
        }

        if (humanoid.behavior === 'sitter') {
            humanoid.rotation.y = Math.PI; // Facing front while sitting
            humanoid.position.y = 0.1;     // Sitting height
        }

        if (humanoid.behavior === 'idler') {
            // Tiny head bobbing idle animation
            const time = performance.now() / 500;
            humanoid.children[1].position.y = 1.8 + 0.05 * Math.sin(time + humanoid.position.x);
        }
    });
}
