

/**
 * Purpose: Randomize materials for visual variety on repeated models.
 * Key features: Procedural random color generator.
 * MIT License: https://github.com/[new-repo-path]/LICENSE
 * Timestamp: 2025-06-25 12:25 | File: js/utils/colorRandomizer.js
 */

export function applyRandomColor(model, baseSaturation = 0.5, baseLightness = 0.6) {
    const randomHue = Math.random(); // Random hue for variety
    const randomColor = new THREE.Color().setHSL(randomHue, baseSaturation, baseLightness);

    model.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
                color: randomColor,
                roughness: 0.5,
                metalness: 0.1
            });
        }
    });
}

