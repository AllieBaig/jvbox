

/**
 * Purpose: Procedurally spawn houses with random positions, rotations and colors.
 * Key features: Loads master house models, randomizes placement and appearance.
 * Dependencies: three.js, GLTFLoader, colorRandomizer.js
 * Related helpers: colorRandomizer.js
 * Function names: loadHouseVariants(), spawnHouses()
 * MIT License: https://github.com/[new-repo-path]/LICENSE
 * Timestamp: 2025-06-25 12:30 | File: js/modules/houseSpawner.js
 */

import * as THREE from '../js/libs/three.module.min.js';
import { GLTFLoader } from '../js/libs/GLTFLoader.js';
import { applyRandomColor } from './colorRandomizer.js';

export class HouseSpawner {
    constructor(scene, activeTown) {
        this.scene = scene;
        this.town = activeTown;
        this.loader = new GLTFLoader();
        this.houseModels = [];
    }

    async loadHouseVariants() {
        // You only need a few master house models:
        const variantPaths = [
            `assets/towns/${this.town}/houses/House1.glb`,
            `assets/towns/${this.town}/houses/House2.glb`,
            `assets/towns/${this.town}/houses/House3.glb`
        ];

        for (let path of variantPaths) {
            try {
                const gltf = await this.loader.loadAsync(path);
                this.houseModels.push(gltf.scene);
                console.log(`[VRBox] Loaded house variant: ${path}`);
            } catch (err) {
                console.warn(`[VRBox] Failed to load house variant: ${path}`);
            }
        }
    }

    spawnHouses(numHouses = 50, areaSize = 50) {
        if (this.houseModels.length === 0) {
            console.warn('[VRBox] No house models loaded!');
            return;
        }

        for (let i = 0; i < numHouses; i++) {
            // Pick random variant
            const template = this.houseModels[Math.floor(Math.random() * this.houseModels.length)];
            const houseClone = template.clone();

            // Random position inside square grid
            const x = (Math.random() - 0.5) * areaSize;
            const z = (Math.random() - 0.5) * areaSize;
            houseClone.position.set(x, 0, z);

            // Random 90-degree rotation for variety
            const randomRot = Math.floor(Math.random() * 4) * (Math.PI / 2);
            houseClone.rotation.y = randomRot;

            // Random color
            applyRandomColor(houseClone);

            // Add to scene
            this.scene.add(houseClone);
        }
    }
}

