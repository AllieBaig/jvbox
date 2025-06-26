


/**
 * Purpose: Main initialization script for LingoQ2 environment
 * Features: Loads environment, road, houses, and handles rendering loop
 * Depends on: three.module.js, OrbitControls, environment.js, road.js, houseSpawner.js, config.js
 * Related: manualHouse.js for house generation
 * Notes: deltaTime-based animation loop using THREE.Clock
 * MIT License: https://github.com/jvbox/LICENSE
 * Timestamp: 2025-06-25 21:15 | File: js/main.js
 */

import * as THREE from './libs/three.module.min.js';
import { OrbitControls } from './libs/OrbitControls.js';

import { Environment } from './environment.js';
import { HouseSpawner } from './houseSpawner.js';
import { Road } from './road.js';
import { config } from './config.js';

let scene, camera, renderer, controls;
let clock, environment, road, houseSpawner;

init();
animate();

function init() {
    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(30, 25, 40);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    // Orbit Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2;

    // Clock
    clock = new THREE.Clock();

    // World Modules
    environment = new Environment(scene);
    road = new Road(scene);
    houseSpawner = new HouseSpawner(scene, CONFIG.house);

    // Resize
    window.addEventListener('resize', onWindowResize);
}

function animate() {
    requestAnimationFrame(animate);
    const deltaTime = clock.getDelta();

    controls.update();
    environment.animate(deltaTime);
    road.update(deltaTime); // Animate lane markings
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


