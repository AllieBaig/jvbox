

/**
 * Purpose: Merged Environment generator combining stylized visuals and procedural elements.
 * Features: Sky gradient, sun glow, moving clouds, wind-animated trees, buildings with windows,
 *           props (signs, poles, barriers), floating particles, grass, flowers, and LOD.
 * Dependencies: THREE.js
 * Related: Called by main.js during scene init
 * Notes: All elements placed directly into the main scene.
 * MIT License: https://github.com/jvbox/LICENSE
 * Timestamp: 2025-06-25 20:55 | File: js/environment.js
 */

import * as THREE from './libs/three.module.min.js';

export class Environment {
    constructor(scene) {
        this.scene = scene;
        this.trees = [];
        this.buildings = [];
        this.props = [];
        this.clouds = [];
        this.time = 0;
        this.windStrength = 0.5;

        this.createSky();
        this.createSun();
        this.createClouds();
        this.createGround();
        this.createTrees();
        this.createBuildings();
        this.createProps();
        this.createGrass();
        this.createFlowers();
        this.createLighting();
        this.createParticles();
    }

    createSky() {
        const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
        const skyMaterial = new THREE.ShaderMaterial({
            uniforms: {
                topColor: { value: new THREE.Color(0x87CEEB) },
                bottomColor: { value: new THREE.Color(0xFFE4B5) },
                offset: { value: 33 },
                exponent: { value: 0.6 }
            },
            vertexShader: `
                varying vec3 vWorldPosition;
                void main() {
                    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                    vWorldPosition = worldPosition.xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 topColor;
                uniform vec3 bottomColor;
                uniform float offset;
                uniform float exponent;
                varying vec3 vWorldPosition;
                void main() {
                    float h = normalize(vWorldPosition + offset).y;
                    gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
                }
            `,
            side: THREE.BackSide
        });
        const sky = new THREE.Mesh(skyGeometry, skyMaterial);
        this.scene.add(sky);
    }

    createSun() {
        const sunGeometry = new THREE.SphereGeometry(8, 16, 16);
        const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF99, transparent: true, opacity: 0.9 });
        this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.sun.position.set(100, 80, -150);
        this.scene.add(this.sun);

        const glowGeometry = new THREE.SphereGeometry(12, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF99, transparent: true, opacity: 0.3 });
        const sunGlow = new THREE.Mesh(glowGeometry, glowMaterial);
        sunGlow.position.copy(this.sun.position);
        this.scene.add(sunGlow);
    }

    createClouds() {
        const cloudMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.8 });

        for (let i = 0; i < 15; i++) {
            const cloud = new THREE.Group();
            for (let j = 0; j < 5; j++) {
                const cloudPart = new THREE.Mesh(
                    new THREE.SphereGeometry(Math.random() * 8 + 4, 8, 8),
                    cloudMaterial
                );
                cloudPart.position.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 20);
                cloud.add(cloudPart);
            }
            cloud.position.set((Math.random() - 0.5) * 400, Math.random() * 40 + 60, (Math.random() - 0.5) * 400);
            this.clouds.push(cloud);
            this.scene.add(cloud);
        }
    }

    createGround() {
        const groundGeometry = new THREE.PlaneGeometry(500, 500, 50, 50);
        const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x90EE90, side: THREE.DoubleSide });
        const vertices = groundGeometry.attributes.position;
        for (let i = 0; i < vertices.count; i++) {
            const x = vertices.getX(i), z = vertices.getZ(i);
            vertices.setY(i, Math.sin(x * 0.01) * Math.cos(z * 0.01) * 2);
        }
        vertices.needsUpdate = true;
        groundGeometry.computeVertexNormals();

        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -2;
        this.scene.add(ground);
    }

    createTrees() {
        const trunkGeom = new THREE.CylinderGeometry(0.3, 0.5, 4);
        const trunkMat = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const foliageGeom = new THREE.SphereGeometry(2.5, 8, 6);
        const foliageMat = new THREE.MeshLambertMaterial({ color: 0x228B22 });

        for (let i = 0; i < 60; i++) {
            const group = new THREE.Group();
            const trunk = new THREE.Mesh(trunkGeom, trunkMat);
            trunk.position.y = 2;
            trunk.castShadow = true;
            const foliage = new THREE.Mesh(foliageGeom, foliageMat);
            foliage.position.y = 5;
            foliage.castShadow = true;
            group.add(trunk, foliage);

            const side = Math.random() > 0.5 ? 1 : -1;
            group.position.set(side * (15 + Math.random() * 20), 0, (Math.random() - 0.5) * 800);

            const scale = 0.7 + Math.random() * 0.6;
            group.scale.set(scale, scale, scale);
            group.rotation.y = Math.random() * Math.PI * 2;
            group.userData = {
                originalScale: scale,
                windPhase: Math.random() * Math.PI * 2,
                windSpeed: 0.5 + Math.random() * 0.5
            };

            this.trees.push(group);
            this.scene.add(group);
        }
    }

    createBuildings() {
        const geometries = [
            new THREE.BoxGeometry(8, 12, 6),
            new THREE.BoxGeometry(6, 16, 8),
            new THREE.BoxGeometry(10, 8, 10),
            new THREE.BoxGeometry(4, 20, 4)
        ];
        const materials = [
            new THREE.MeshLambertMaterial({ color: 0x8B7355 }),
            new THREE.MeshLambertMaterial({ color: 0x696969 }),
            new THREE.MeshLambertMaterial({ color: 0xA0522D }),
            new THREE.MeshLambertMaterial({ color: 0x778899 })
        ];

        for (let i = 0; i < 25; i++) {
            const geom = geometries[Math.floor(Math.random() * geometries.length)];
            const mat = materials[Math.floor(Math.random() * materials.length)];
            const building = new THREE.Mesh(geom, mat);

            const side = Math.random() > 0.5 ? 1 : -1;
            const distance = 60 + Math.random() * 100;
            building.position.set(side * distance, geom.parameters.height / 2, (Math.random() - 0.5) * 600);
            building.rotation.y = Math.random() * Math.PI * 2;
            building.castShadow = true;
            building.receiveShadow = true;

            this.addWindows(building);
            this.buildings.push(building);
            this.scene.add(building);
        }
    }

    addWindows(building) {
        const geometry = new THREE.PlaneGeometry(0.8, 1.2);
        const material = new THREE.MeshBasicMaterial({ color: 0x87CEEB, transparent: true, opacity: 0.7 });
        const box = new THREE.Box3().setFromObject(building);
        const w = box.max.x - box.min.x, h = box.max.y - box.min.y, d = box.max.z - box.min.z;

        const rows = Math.floor(h / 3), cols = Math.floor(w / 2);
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                if (Math.random() > 0.3) {
                    const win = new THREE.Mesh(geometry, material.clone());
                    win.position.set((i - cols / 2 + 0.5) * 2, (j - rows / 2 + 0.5) * 3 + h / 2, d / 2 + 0.01);
                    win.material.opacity = 0.3 + Math.random() * 0.5;
                    building.add(win);
                }
            }
        }
    }

    createProps() {
        const pole = new THREE.CylinderGeometry(0.05, 0.05, 3);
        const poleMat = new THREE.MeshLambertMaterial({ color: 0x888888 });
        const sign = new THREE.PlaneGeometry(1.5, 1.5);
        const signMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });

        for (let i = 0; i < 6; i++) {
            const group = new THREE.Group();
            const poleMesh = new THREE.Mesh(pole, poleMat);
            poleMesh.position.y = 1.5;
            const signMesh = new THREE.Mesh(sign, signMat);
            signMesh.position.y = 2.5;
            group.add(poleMesh, signMesh);

            const side = Math.random() > 0.5 ? 1 : -1;
            group.position.set(side * (8 + Math.random() * 5), 0, (Math.random() - 0.5) * 400);
            this.scene.add(group);
        }
    }

    createGrass() {
        const material = new THREE.MeshLambertMaterial({ color: 0x32CD32 });
        for (let i = 0; i < 200; i++) {
            const cone = new THREE.ConeGeometry(0.1, Math.random() * 2 + 1, 4);
            const mesh = new THREE.Mesh(cone, material);
            mesh.position.set((Math.random() - 0.5) * 300, 0, (Math.random() - 0.5) * 300);
            this.scene.add(mesh);
        }
    }

    createFlowers() {
        const colors = [0xFF69B4, 0xFF6347, 0xFFD700, 0x9370DB, 0xFF1493];
        for (let i = 0; i < 40; i++) {
            const flower = new THREE.Group();
            const stem = new THREE.Mesh(
                new THREE.CylinderGeometry(0.05, 0.05, 1, 4),
                new THREE.MeshLambertMaterial({ color: 0x228B22 })
            );
            stem.position.y = 0.5;
            flower.add(stem);

            const color = colors[Math.floor(Math.random() * colors.length)];
            const petalMat = new THREE.MeshLambertMaterial({ color });
            for (let j = 0; j < 6; j++) {
                const petal = new THREE.Mesh(new THREE.SphereGeometry(0.3, 6, 6), petalMat);
                const angle = (j / 6) * Math.PI * 2;
                petal.position.set(Math.cos(angle) * 0.4, 1.2, Math.sin(angle) * 0.4);
                petal.scale.set(0.5, 0.3, 0.5);
                flower.add(petal);
            }

            flower.position.set((Math.random() - 0.5) * 200, 0, (Math.random() - 0.5) * 200);
            this.scene.add(flower);
        }
    }

    createLighting() {
        const ambient = new THREE.AmbientLight(0x404040, 0.6);
        const sunLight = new THREE.DirectionalLight(0xFFFFCC, 1);
        sunLight.position.set(100, 100, -100);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;

        this.scene.add(ambient, sunLight);
    }

    createParticles() {
        const count = 100;
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 200;
            positions[i + 1] = Math.random() * 20;
            positions[i + 2] = (Math.random() - 0.5) * 200;
        }
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, transparent: true, opacity: 0.6 });
        this.particleSystem = new THREE.Points(geo, mat);
        this.scene.add(this.particleSystem);
    }

    update(deltaTime, cameraPosition) {
        this.time += deltaTime;

        // Wind animation
        this.trees.forEach(tree => {
            const ud = tree.userData;
            const wind = Math.sin(this.time * ud.windSpeed + ud.windPhase) * this.windStrength;
            tree.rotation.z = wind * 0.1;
            tree.scale.x = ud.originalScale + wind * 0.05;
        });

        // Animate clouds
        this.clouds.forEach((c, i) => {
            c.position.x += Math.sin(Date.now() * 0.0001 + i) * 0.01;
            c.position.z += Math.cos(Date.now() * 0.0001 + i) * 0.01;
        });

        if (this.sun) {
            this.sun.material.opacity = 0.8 + Math.sin(Date.now() * 0.001) * 0.1;
        }

        // Animate particles
        if (this.particleSystem) {
            this.particleSystem.rotation.y += deltaTime * 0.1;
            const pos = this.particleSystem.geometry.attributes.position.array;
            for (let i = 1; i < pos.length; i += 3) {
                pos[i] += deltaTime * 2;
                if (pos[i] > 30) pos[i] = 0;
            }
            this.particleSystem.geometry.attributes.position.needsUpdate = true;
        }

        // Level of Detail
        const maxDist = 150;
        [...this.trees, ...this.buildings, ...this.props].forEach(obj => {
            obj.visible = obj.position.distanceTo(cameraPosition) < maxDist;
        });
    }
}

