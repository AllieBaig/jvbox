

/**
 * Purpose: Render simple gradient sky background (Summer Afternoon style).
 * Key features: Lightweight, fully mobile friendly.
 * Dependencies: three.js
 * Function names: addGradientSky()
 * MIT License: https://github.com/[new-repo-path]/LICENSE
 * Timestamp: 2025-06-25 12:50 | File: js/skyRenderer.js
 */

import * as THREE from './libs/three.module.min.js';

export function addGradientSky(scene) {
    const skyGeometry = new THREE.SphereGeometry(500, 32, 15);
    const topColor = new THREE.Color(0xaeeeee);  // Light blue top
    const bottomColor = new THREE.Color(0xffffff);  // White bottom
    const skyMaterial = new THREE.ShaderMaterial({
        uniforms: {
            topColor: { value: topColor },
            bottomColor: { value: bottomColor },
            offset: { value: 400 },
            exponent: { value: 0.6 }
        },
        vertexShader: `
            varying float vY;
            void main() {
                vY = position.y;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying float vY;
            uniform vec3 topColor;
            uniform vec3 bottomColor;
            uniform float offset;
            uniform float exponent;
            void main() {
                float h = normalize(vec3(0.0, vY + offset, 0.0)).y;
                gl_FragColor = vec4(mix(bottomColor, topColor, pow(max(h, 0.0), exponent)), 1.0);
            }
        `,
        side: THREE.BackSide,
        depthWrite: false
    });

    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(sky);

    console.log('[VRBox] Gradient sky added.');
}

