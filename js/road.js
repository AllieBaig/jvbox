
import * as THREE from './libs/three.module.min.js';


export class Road {  
    constructor(scene) {  
        this.scene = scene;  
        this.roadMesh = null;  
        this.roadMarkings = [];  
        this.roadSides = [];  
        this.time = 0;  
        this.roadLength = 1000;  
        this.roadWidth = 12;  
          
        this.init();  
    }  
      
    init() {  
        this.createRoad();  
        this.createRoadMarkings();  
        this.createRoadSides();  
        this.createStreetLights();  
    }  
      
    createRoad() {  
        // Main road surface  
        const roadGeometry = new THREE.PlaneGeometry(this.roadWidth, this.roadLength);  
        roadGeometry.rotateX(-Math.PI / 2);  
          
        // Create asphalt texture using canvas  
        const canvas = document.createElement('canvas');  
        canvas.width = 512;  
        canvas.height = 512;  
        const ctx = canvas.getContext('2d');  
          
        // Base asphalt color  
        ctx.fillStyle = '#2a2a2a';  
        ctx.fillRect(0, 0, 512, 512);  
          
        // Add noise for texture  
        const imageData = ctx.getImageData(0, 0, 512, 512);  
        const data = imageData.data;  
          
        for (let i = 0; i < data.length; i += 4) {  
            const noise = (Math.random() - 0.5) * 30;  
            data[i] = Math.max(0, Math.min(255, data[i] + noise));     // R  
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // G  
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // B  
        }  
          
        ctx.putImageData(imageData, 0, 0);  
          
        const roadTexture = new THREE.CanvasTexture(canvas);  
        roadTexture.wrapS = THREE.RepeatWrapping;  
        roadTexture.wrapT = THREE.RepeatWrapping;  
        roadTexture.repeat.set(1, 20);  
          
        const roadMaterial = new THREE.MeshLambertMaterial({  
            map: roadTexture,  
            color: 0x333333  
        });  
          
        this.roadMesh = new THREE.Mesh(roadGeometry, roadMaterial);  
        this.roadMesh.receiveShadow = true;  
        this.scene.add(this.roadMesh);  
    }  
      
    createRoadMarkings() {  
        // Center line markings  
        const markingGeometry = new THREE.PlaneGeometry(0.3, 8);  
        markingGeometry.rotateX(-Math.PI / 2);  
          
        const markingMaterial = new THREE.MeshBasicMaterial({  
            color: 0xffffff,  
            transparent: true,  
            opacity: 0.9  
        });  
          
        // Create dashed center line  
        for (let i = -this.roadLength/2; i < this.roadLength/2; i += 16) {  
            const marking = new THREE.Mesh(markingGeometry, markingMaterial);  
            marking.position.set(0, 0.01, i);  
              
            // Store initial position for animation  
            marking.userData = { initialZ: i };  
              
            this.roadMarkings.push(marking);  
            this.scene.add(marking);  
        }  
          
        // Side lane markings  
        const sideLaneGeometry = new THREE.PlaneGeometry(0.2, this.roadLength);  
        sideLaneGeometry.rotateX(-Math.PI / 2);  
          
        const leftLane = new THREE.Mesh(sideLaneGeometry, markingMaterial);  
        leftLane.position.set(-this.roadWidth/2 + 0.5, 0.01, 0);  
        this.scene.add(leftLane);  
          
        const rightLane = new THREE.Mesh(sideLaneGeometry, markingMaterial);  
        rightLane.position.set(this.roadWidth/2 - 0.5, 0.01, 0);  
        this.scene.add(rightLane);  
    }  
      
    createRoadSides() {  
        // Grass/dirt sides  
        const sideGeometry = new THREE.PlaneGeometry(30, this.roadLength);  
        sideGeometry.rotateX(-Math.PI / 2);  
          
        // Create grass texture  
        const grassCanvas = document.createElement('canvas');  
        grassCanvas.width = 256;  
        grassCanvas.height = 256;  
        const grassCtx = grassCanvas.getContext('2d');  
          
        // Base grass color  
        grassCtx.fillStyle = '#4a7c59';  
        grassCtx.fillRect(0, 0, 256, 256);  
          
        // Add grass texture variation  
        const grassImageData = grassCtx.getImageData(0, 0, 256, 256);  
        const grassData = grassImageData.data;  
          
        for (let i = 0; i < grassData.length; i += 4) {  
            const noise = (Math.random() - 0.5) * 40;  
            grassData[i] = Math.max(0, Math.min(255, grassData[i] + noise));  
            grassData[i + 1] = Math.max(0, Math.min(255, grassData[i + 1] + noise));  
            grassData[i + 2] = Math.max(0, Math.min(255, grassData[i + 2] + noise));  
        }  
          
        grassCtx.putImageData(grassImageData, 0, 0);  
          
        const grassTexture = new THREE.CanvasTexture(grassCanvas);  
        grassTexture.wrapS = THREE.RepeatWrapping;  
        grassTexture.wrapT = THREE.RepeatWrapping;  
        grassTexture.repeat.set(10, 40);  
          
        const grassMaterial = new THREE.MeshLambertMaterial({  
            map: grassTexture,  
            color: 0x5a8c6a  
        });  
          
        // Left side  
        const leftSide = new THREE.Mesh(sideGeometry, grassMaterial);  
        leftSide.position.set(-this.roadWidth/2 - 15, -0.1, 0);  
        leftSide.receiveShadow = true;  
        this.scene.add(leftSide);  
          
        // Right side    
        const rightSide = new THREE.Mesh(sideGeometry, grassMaterial);  
        rightSide.position.set(this.roadWidth/2 + 15, -0.1, 0);  
        rightSide.receiveShadow = true;  
        this.scene.add(rightSide);  
          
        this.roadSides.push(leftSide, rightSide);  
    }  
      
    createStreetLights() {  
        const poleGeometry = new THREE.CylinderGeometry(0.15, 0.15, 8);  
        const poleMaterial = new THREE.MeshLambertMaterial({ color: 0x444444 });  
          
        const lightGeometry = new THREE.SphereGeometry(0.5);  
        const lightMaterial = new THREE.MeshBasicMaterial({  
            color: 0xffffaa,  
            emissive: 0xffffaa,  
            emissiveIntensity: 0.3  
        });  
          
        // Create street lights along the road  
        for (let i = -this.roadLength/2; i < this.roadLength/2; i += 40) {  
            // Left side light  
            const leftPole = new THREE.Mesh(poleGeometry, poleMaterial);  
            leftPole.position.set(-this.roadWidth/2 - 3, 4, i);  
            leftPole.castShadow = true;  
            this.scene.add(leftPole);  
              
            const leftLight = new THREE.Mesh(lightGeometry, lightMaterial);  
            leftLight.position.set(-this.roadWidth/2 - 3, 7.5, i);  
            this.scene.add(leftLight);  
              
            // Add point light for illumination  
            const pointLight = new THREE.PointLight(0xffffaa, 0.5, 20);  
            pointLight.position.set(-this.roadWidth/2 - 3, 7.5, i);  
            pointLight.castShadow = true;  
            this.scene.add(pointLight);  
              
            // Right side light  
            const rightPole = new THREE.Mesh(poleGeometry, poleMaterial);  
            rightPole.position.set(this.roadWidth/2 + 3, 4, i);  
            rightPole.castShadow = true;  
            this.scene.add(rightPole);  
              
            const rightLight = new THREE.Mesh(lightGeometry, lightMaterial);  
            rightLight.position.set(this.roadWidth/2 + 3, 7.5, i);  
            this.scene.add(rightLight);  
              
            // Add point light for illumination  
            const pointLight2 = new THREE.PointLight(0xffffaa, 0.5, 20);  
            pointLight2.position.set(this.roadWidth/2 + 3, 7.5, i);  
            pointLight2.castShadow = true;  
            this.scene.add(pointLight2);  
        }  
    }  
      
    update(deltaTime) {  
        this.time += deltaTime;  
          
        // Animate road markings to create movement illusion  
        this.roadMarkings.forEach(marking => {  
            marking.position.z += deltaTime * 20; // Speed of road movement  
              
            // Reset position when marking goes too far  
            if (marking.position.z > this.roadLength/2 + 10) {  
                marking.position.z = -this.roadLength/2 - 10;  
            }  
        });  
          
        // Subtle road surface animation  
        if (this.roadMesh && this.roadMesh.material.map) {  
            this.roadMesh.material.map.offset.y -= deltaTime * 0.5;  
        }  
    }  
}
