
/**
 * Purpose: Main entry point for VRBox procedural town with animated pedestrians.
 * Key features: Loads scene, camera, lighting, full procedural city generation.
 * Dependencies: three.js, houseSpawner.js, carSpawner.js, roadGenerator.js, skyRenderer.js, pedestrianSpawner.js
 * MIT License: https://github.com/[new-repo-path]/LICENSE
 * Timestamp: 2025-06-25 13:20 | File: js/main.js
 */

import * as THREE from '../js/libs/three.module.min.js';
import { OrbitControls } from '../js/libs/OrbitControls.js';

import { addGradientSky } from './skyRenderer.js';
import { generateRoadGrid } from './roadGenerator.js';
import { HouseSpawner } from './houseSpawner.js';
import { CarSpawner } from './carSpawner.js';
import { PedestrianSpawner } from './pedestrianSpawner.js';

let scene, camera, renderer, controls;
let pedestrianSpawner;

const ACTIVE_TOWN = 'town1';

init();
animate();

async function init() {
    // Setup scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xddeeff);

    // Camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 60, 80);
    camera.lookAt(0, 0, 0);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();

    // Lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
    hemiLight.position.set(0, 100, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(50, 50, 25);
    scene.add(dirLight);

    // Sky
    addGradientSky(scene);

    // Roads
    generateRoadGrid(scene, 50, 10);

    // Houses
    const houseSpawner = new HouseSpawner(scene, ACTIVE_TOWN);
    await houseSpawner.loadHouseVariants();
    houseSpawner.spawnHouses(10, 50);

    // Cars
    const carSpawner = new CarSpawner(scene, ACTIVE_TOWN);
    await carSpawner.loadCarVariants();
    carSpawner.spawnCars(20, 50, 10);

    // Pedestrians
    pedestrianSpawner = new PedestrianSpawner(scene, ACTIVE_TOWN);
    await pedestrianSpawner.loadPedestrianModel();
    pedestrianSpawner.spawnPedestrians(10, 50);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();

    if (pedestrianSpawner) {
        pedestrianSpawner.updatePedestrians();
    }

    renderer.render(scene, camera);
}
