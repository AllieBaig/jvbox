
/**
 * Purpose: Setup 3D scene, camera, lights, and renderer for VRBox v10.
 * Key features: Basic Three.js scene setup, ambient and directional lights, resize-ready.
 * Dependencies: three.module.min.js
 * Related helpers: main.js calls setupScene()
 * Function names: setupScene()
 * MIT License: https://github.com/[new-repo-path]/LICENSE
 * Timestamp: 2025-06-22 10:05 | File: js/sceneSetup.js
 */

import * as THREE from '../js/libs/three.module.min.js';
import { OrbitControls } from '../js/libs/OrbitControls.js';

export let scene, camera, renderer, controls;

export function setupScene() {
    console.log("[VRBox] Setting up scene...");

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);

    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 5, 10);

    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('renderCanvas'), antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Orbit Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.enablePan = false;
    controls.maxPolarAngle = Math.PI / 2;

    console.log("[VRBox] Scene setup complete.");
}
