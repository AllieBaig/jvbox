

/**
 * Purpose: iOS-friendly custom component dropdown for VRBox v10 town selector.
 * Key features: Fully custom dropdown, fully DOM-controlled, touch-safe.
 * Dependencies: None
 * Related helpers: main.js
 * Function names: renderTownSelector(), getSelectedTown()
 * MIT License: https://github.com/[new-repo-path]/LICENSE
 * Timestamp: 2025-06-22 12:20 | File: js/components/townSelector.js
 */

export function renderTownSelector(townList) {
    console.log("[VRBox] Rendering custom town selector...");

    const container = document.getElementById('uiOverlay');

    const panel = document.createElement('div');
    panel.style.position = 'absolute';
    panel.style.top = 'calc(20px + env(safe-area-inset-top))';
    panel.style.left = 'calc(20px + env(safe-area-inset-left))';
    panel.style.background = '#333';
    panel.style.padding = '12px';
    panel.style.borderRadius = '12px';
    panel.style.boxShadow = '0 4px 10px rgba(0,0,0,0.5)';
    panel.style.zIndex = '20';
    panel.style.pointerEvents = 'auto';
    panel.style.userSelect = 'none';

    const label = document.createElement('div');
    label.textContent = 'Select Town:';
    label.style.color = '#fff';
    label.style.fontSize = '1.1em';
    label.style.marginBottom = '8px';
    panel.appendChild(label);

    const dropdown = document.createElement('div');
    dropdown.style.background = '#222';
    dropdown.style.color = '#fff';
    dropdown.style.padding = '10px';
    dropdown.style.borderRadius = '8px';
    dropdown.style.cursor = 'pointer';
    dropdown.style.position = 'relative';
    dropdown.style.minWidth = '160px';
    dropdown.textContent = getSelectedTown('town1');

    const list = document.createElement('div');
    list.style.position = 'absolute';
    list.style.top = '100%';
    list.style.left = '0';
    list.style.background = '#444';
    list.style.borderRadius = '8px';
    list.style.display = 'none';
    list.style.flexDirection = 'column';
    list.style.zIndex = '999';

    townList.forEach(town => {
        const item = document.createElement('div');
        item.textContent = town;
        item.style.padding = '10px';
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            dropdown.textContent = town;
            localStorage.setItem('VRBoxSelectedTown', town);
            list.style.display = 'none';
            location.reload();
        });
        list.appendChild(item);
    });

    dropdown.addEventListener('click', () => {
        list.style.display = (list.style.display === 'none') ? 'flex' : 'none';
    });

    dropdown.appendChild(list);
    panel.appendChild(dropdown);
    container.appendChild(panel);
}

export function getSelectedTown(defaultTown = 'town1') {
    return localStorage.getItem('VRBoxSelectedTown') || defaultTown;
}

