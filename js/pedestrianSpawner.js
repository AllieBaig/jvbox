

/**
 * Purpose: Procedurally spawn simple walking humanoid agents.
 * Key features: Random walking direction, simple animation.
 * Dependencies: three.js, GLTFLoader
 * Function names: loadPedestrianModel(), spawnPedestrians(), updatePedestrians()
 * MIT License: https://github.com/[new-repo-path]/LICENSE
 * Timestamp: 2025-06-25 13:15 | File: js/pedestrianSpawner.js
 */

import * as THREE from './libs/three.module.min.js';
import { GLTFLoader } from './libs/GLTFLoader.js';

export class PedestrianSpawner {
    constructor(scene, activeTown) {
        this.scene = scene;
        this.town = activeTown;
        this.loader = new GLTFLoader();
        this.pedestrianModel = null;
        this.pedestrians = [];
    }

    async loadPedestrianModel() {
        const path = `assets/towns/${this.town}/humanoids/CuteLowPolyHumanoid.glb`;
        try {
            const gltf = await this.loader.loadAsync(path);
            this.pedestrianModel = gltf.scene;
            console.log(`[VRBox] Loaded pedestrian model: ${path}`);
        } catch (err) {
            console.warn(`[VRBox] Failed to load pedestrian model: ${path}`);
        }
    }

    spawnPedestrians(num = 10, areaSize = 50) {
        if (!this.pedestrianModel) {
            console.warn('[VRBox] Pedestrian model not loaded!');
            return;
        }

        for (let i = 0; i < num; i++) {
            const clone = this.pedestrianModel.clone();

            const x = (Math.random() - 0.5) * areaSize;
            const z = (Math.random() - 0.5) * areaSize;
            clone.position.set(x, 0, z);

            const direction = Math.random() * Math.PI * 2;
            clone.rotation.y = direction;

            const speed = 0.02 + Math.random() * 0.02; // Small variation in walking speed

            this.pedestrians.push({ object: clone, direction, speed });
            this.scene.add(clone);
        }
    }

    updatePedestrians() {
        for (let ped of this.pedestrians) {
            const dx = Math.sin(ped.direction) * ped.speed;
            const dz = Math.cos(ped.direction) * ped.speed;

            ped.object.position.x += dx;
            ped.object.position.z += dz;

            // Simple bounds wrap-around
            if (ped.object.position.x > 30) ped.object.position.x = -30;
            if (ped.object.position.x < -30) ped.object.position.x = 30;
            if (ped.object.position.z > 30) ped.object.position.z = -30;
            if (ped.object.position.z < -30) ped.object.position.z = 30;
        }
    }
}

