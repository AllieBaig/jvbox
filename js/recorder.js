
/**
 * Purpose: Log trial-and-error movement data for reinforcement learning in VRBox v10.
 * Key features: Simple in-memory recorder, logs control state per frame.
 * Dependencies: None
 * Related helpers: main.js (calls recorder.recordStep()), controls.js, joystickControls.js
 * Function names: setupRecorder(), recordStep(), exportLog()
 * MIT License: https://github.com/[new-repo-path]/LICENSE
 * Timestamp: 2025-06-22 10:25 | File: js/recorder.js
 */

export let recorder = null;

export function setupRecorder() {
    console.log("[VRBox] Setting up recorder...");

    recorder = {
        log: [],
        isRecording: false,

        start() {
            console.log("[VRBox] Recording started.");
            this.log = [];
            this.isRecording = true;
        },

        stop() {
            console.log("[VRBox] Recording stopped.");
            this.isRecording = false;
        },

        recordStep(controlState) {
            if (!this.isRecording) return;
            this.log.push({
                timestamp: Date.now(),
                state: { ...controlState }
            });
        },

        exportLog() {
            console.log("[VRBox] Exporting log:", this.log);
            return JSON.stringify(this.log, null, 2);
        }
    };

    // Wire up UI buttons
    const recordBtn = document.getElementById('recordBtn');
    const resetBtn = document.getElementById('resetBtn');

    recordBtn.addEventListener('click', () => {
        if (recorder.isRecording) {
            recorder.stop();
            alert("Recording stopped.");
            console.log(recorder.exportLog());
        } else {
            recorder.start();
            alert("Recording started.");
        }
    });

    resetBtn.addEventListener('click', () => {
        location.reload();
    });

    console.log("[VRBox] Recorder ready.");
}
