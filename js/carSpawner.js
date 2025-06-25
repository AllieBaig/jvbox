

/**
 * Purpose: Procedurally spawn cars along roads.
 * Key features: Random placement, random colors, random directions.
 * Dependencies: three.js, GLTFLoader, colorRandomizer.js
 * Related helpers: colorRandomizer.js
 * Function names: loadCarVariants(), spawnCars()
 * MIT License: https://github.com/[new-repo-path]/LICENSE
 * Timestamp: 2025-06-25 13:00 | File: js/carSpawner.js
 */

import * as THREE from '../libs/three.module.min.js';
import { GLTFLoader } from '../libs/GLTFLoader.js';
import { applyRandomColor } from './colorRandomizer.js';

export class CarSpawner {
    constructor(scene, activeTown) {
        this.scene = scene;
        this.town = activeTown;
        this.loader = new GLTFLoader();
        this.carModels = [];
    }

    async loadCarVariants() {
        // Load a few base car models
        const variantPaths = [
            `assets/towns/${this.town}/cars/Car1.glb`,
            `assets/towns/${this.town}/cars/Car2.glb`,
            `assets/towns/${this.town}/cars/Car3.glb`
        ];

        for (let path of variantPaths) {
            try {
                const gltf = await this.loader.loadAsync(path);
                this.carModels.push(gltf.scene);
                console.log(`[VRBox] Loaded car variant: ${path}`);
            } catch (err) {
                console.warn(`[VRBox] Failed to load car variant: ${path}`);
            }
        }
    }

    spawnCars(numCars = 20, gridSize = 50, cellSize = 10) {
        if (this.carModels.length === 0) {
            console.warn('[VRBox] No car models loaded!');
            return;
        }

        for (let i = 0; i < numCars; i++) {
            const template = this.carModels[Math.floor(Math.random() * this.carModels.length)];
            const carClone = template.clone();

            // Randomly choose to place along X or Z road
            const horizontal = Math.random() > 0.5;

            let x = 0;
            let z = 0;

            if (horizontal) {
                x = (Math.random() - 0.5) * gridSize;
                z = Math.floor((Math.random() * gridSize) / cellSize) * cellSize - (gridSize / 2);
                carClone.rotation.y = 0; // face along Z
            } else {
                z = (Math.random() - 0.5) * gridSize;
                x = Math.floor((Math.random() * gridSize) / cellSize) * cellSize - (gridSize / 2);
                carClone.rotation.y = Math.PI / 2; // face along X
            }

            carClone.position.set(x, 0, z);

            applyRandomColor(carClone);
            this.scene.add(carClone);
        }
    }
}

