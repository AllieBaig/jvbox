
/**
 * Purpose: Spawns multiple procedural houses with layout and color variations
 * Key Features: Uses ManualHouse, random position layout, config-driven
 * Dependencies: manualHouse.js, colorRandomizer.js, config.js
 * Related Files: js/manualHouse.js, js/config.js
 * Special Notes: Layout, count, and color mode are controlled by config
 * MIT License: https://github.com/jvbox/LICENSE
 * Timestamp: 2025-06-25 21:10 | File: js/houseSpawner.js
 */

import { createManualHouse } from './manualHouse.js';
import { applyRandomColor } from './colorRandomizer.js';
import { config } from './config.js';

export class HouseSpawner {
    constructor(scene) {
        this.scene = scene;
        this.houses = [];
    }

    spawnHouses() {
        const layoutType = config.houses.layout;
        const count = config.houses.count || 10;
        const spacing = config.houses.spacing || 15;

        for (let i = 0; i < count; i++) {
            let x = 0, z = 0;

            if (layoutType === 'grid') {
                const row = Math.floor(i / 5);
                const col = i % 5;
                x = col * spacing - (spacing * 2);
                z = row * spacing - (spacing * 1.5);
            } else {
                x = (Math.random() - 0.5) * 100;
                z = (Math.random() - 0.5) * 100;
            }

            const position = new THREE.Vector3(x, 0, z);
            const house = ManualHouse.generate(this.scene, position);

            if (config.houses.useColorVariation) {
                applyRandomColor(house);
            }

            this.houses.push(house);
        }
    }
}
