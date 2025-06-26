
/**
 * Configuration for environment styling and procedural layout
 * MIT License: https://github.com/jvbox/LICENSE
 * Timestamp: 2025-06-25 22:35 | File: js/config.js
 */

export const config = {
    layout: {
        houseCount: 10,
        roadSpacing: 20,
        randomizeRotation: true,
        layoutPattern: "grid", // Options: "grid", "scattered", "ring"
    },

    house: {
        baseColors: [
            0xF5DEB3, // wheat
            0xE9967A, // dark salmon
            0xADD8E6, // light blue
            0xFFD700, // gold
            0x98FB98, // pale green
            0xFFB6C1  // light pink
        ],
        roofColors: [
            0x8B4513, // saddle brown
            0x2F4F4F, // dark slate gray
            0xA52A2A, // brown
            0x4B0082  // indigo
        ],
        doorColor: 0x654321,
        windowColor: 0x87CEEB,
        randomizePerHouse: true
    },

    environment: {
        fogColor: 0x87CEEB,
        groundColor: 0x90EE90,
        treeColor: 0x228B22,
        trunkColor: 0x8B4513,
        flowerColors: [
            0xFF69B4, 0xFF6347, 0xFFD700,
            0x9370DB, 0xFF1493
        ]
    },

    performance: {
        useLOD: true,
        maxVisibleDistance: 150
    }
};
