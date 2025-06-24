
/**
 * Purpose: Scene setup module for VRBox v10 with modular camera system.
 * Key features: Modular camera, renderer, lighting setup.
 * Dependencies: three.module.min.js, cameraSetup.js
 * Related helpers: main.js, assetBasedTownBuilder.js
 * Function names: setupScene()
 * MIT License: https://github.com/[new-repo-path]/LICENSE
 * Timestamp: 2025-06-22 14:05 | File: js/sceneSetup.js
 */

import * as THREE from '../js/libs/three.module.min.js';
import { createCamera, createControls, camera, controls } from './cameraSetup.js';

export let scene, renderer;

export function setupScene() {
    console.log("[VRBox] Setting up scene...");

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa0d8f0); // Sky blue background

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    createCamera(renderer);
    createControls(renderer);

    // Lighting setup
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
    hemiLight.position.set(0, 200, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(100, 100, 50);
    scene.add(dirLight);

    console.log("[VRBox] Scene setup complete.");
}
