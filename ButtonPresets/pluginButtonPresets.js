/*
    Preset Buttons v1.3.5 by AAD
    https://github.com/AmateurAudioDude/FM-DX-Webserver-Plugin-Button-Presets
*/

'use strict';

// Global variables for other plugins
const pluginButtonPresets = true;

(() => {

//////////////////////////////////////////////////

const bankMenuLocation = 'top' // ims, bw, ant, eq, top, top-replace, hidden
const bankMenuPosition = 'after' // before, after
const bankMenuPaddingLeft = '15' // value in px
const bankMenuPaddingRight = '0' // value in px
const bankMenuBorderLeftRadius = true; // true, false
const bankMenuBorderRightRadius = true; // true, false
const bankMenuCustomWidth = 'default'; // default, value in px or %
const bankName = t('menu.bank'); // dropdown menu name
const bankQuantity = 4; // total number of banks ranging from 3-8 (for 'top' or 'top-replace' use either 4 or 8)
const optionHidePresetButtons = false; // true, false
const optionHideDisplayAll = true; // true, false
const optionSaveAntenna = (!!document.getElementById('data-ant')); // (!!document.getElementById('data-ant')), true, false
const optionAntennaDisplay = 'number'; // number, letter
const optionHighlightSelectedPreset = true; // true, false
const displayDefaultLogo = true; // true, false
const enableDefaultLogo = 'unnamed'; // all, named, unnamed
const infoIcon = true; // true, false
const allowCustomFont = 'default'; // default, true, false
const defaultPresetData = {
  values: [87.3, 87.3, 87.3, 87.3, 87.3, 87.3, 87.3, 87.3, 87.3, 87.3],
  antennas: ['', '', '', '', '', '', '', '', '', ''],
  names: ['', '', '', '', '', '', '', '', '', ''],
  urls: ['', '', '', '', '', '', '', '', '', '']
};

//////////////////////////////////////////////////

/*

  defaultPresetData:

  "antennas" is an optional parameter:
  '0' = Antenna 1, '1' = Antenna 2, '2' = Antenna 3, '3' = Antenna 4.

  Examples:
  
  values: [99.7, ...
  antennas: ['0', ...
  names: ['Example', ...
  urls: ['/logos/Example.png', ...

  values: [99.7, ...
  antennas: ['0', ...
  names: ['Example', ...
  urls: ['https://tef.noobish.eu/logos/EXA/Example.png', ...

*/

const pluginVersion = '1.3.5';
const pluginName = "Preset Buttons";
const pluginHomepageUrl = "https://github.com/AmateurAudioDude/FM-DX-Webserver-Plugin-Button-Presets";
const pluginUpdateUrl = "https://raw.githubusercontent.com/AmateurAudioDude/FM-DX-Webserver-Plugin-Button-Presets/refs/heads/main/ButtonPresets/pluginButtonPresets.js";
const pluginSetupOnlyNotify = true;
const CHECK_FOR_UPDATES = true;

// Initial value
let bankDisplayAll = false;

// Global variables for keyboard preset navigation
let currentPresetIndex = 0; // (0-9)
let currentPresetBank = 'A'; // Preset bank
let frequencyObserver; // MutationObserver for frequency changes
let lastUsedPreset = null; // Smart highlighting
let keysPressed = new Set(); // Track which keys are currently pressed
let hasUsedKeyboardNavigation = false; // Track if keyboard navigation has been used

// Create default logo
let defaultButtonPresetImagePath = ' data:image/webp;base64,UklGRpQEAABXRUJQVlA4TIgEAAAvP8APEBXRkf/Pbd1c5R2FR8FRcBQcBUdBKWdlqdvR7v4ZVDv8lMXKgT0652z3QEnVL5RK/Ds8OBsFR5EDdM6JPUf9dhRQeegcqCyCM1RW9ypns2LnNpJkV5n8o/ghYGqY89DCw5yfidPYtq1ml85zyPwTeSaKEpD7dnLoxCDANKGEEkooRznKUW4yBm4bKUr3aPnuBv6A+xnIAXlQAStgbFCZTTjUYp2Kdebxx8XMiJk61R9RxgL6TWGBasOBCiDPHRidErVrxjMnZkHkmXdyrOqxhg1V26qpWJBc4sFqd20x65lXX398uvoaTq42SHkFz+Apbm4JTF8rX66BuoCXFBYYgJ3xyvPq741PP5WERMbTd7QCBHxXqPJd1fiPkdcaO1m+svr748ynq7+BmZOEmcPwXv+EoXF0SiDAhig8uDlQRY5YtFa6XF0ETPjM+ueLM2c4OZeWqqVSN2f7ShiuPobV22A6MeK9ZarqVu2UYFEnnFg0gN9XdXUg5c3XGx99dIVdM8+BqFTVGZrwbg+2mdtApn3aDKgPjbFrdLy25c3/HXbLkOsycGR2RR7JBZTVtGW23X082GaOkKpl4FWzantiPL2xokSViN9ixHYWeIy8UVteryR2GkDWcGFc2P2DRgZgDizLNnMuQtSXCDjAqjFPr9qcmLrCxvBoxEcQFZIBcCS5sv55o8nqvtHPNfUbqgzDb1dvD0yXrPAdekPzh7mteI1HnGRoEJN4lzdfd5r8rmakZXQawG2zbWpcXWCx0Gw79pacZKzw2k7ilgUG6jlCNOOlK7MAaORl1QAs1XYzXb0JwwA2SH2Nx2J0JE85ICAW63pJG+NXJPvlMy8t8U4g62sURU5NrW2mU7OPvGCGfZKhAwYEWPVMkZGWiSIl1+KA7x8oyMWqVnT071lEqJs//jBixoDgMo9GbGV0loG2IgAGigNlzHkABMOfZQPZhw2GVa0QMyE8p3NA40oi2a/ezgcAv9C/aG9otuDpAt/pRIovgMd0vstrJ6qEVTU0OmVPp7fiw3dY0E70Yat0CbQuOkWm8zcZdqHSRO3qJrJrFWmZieoKMVcAwaWERzwhHzrCHEiz2141duu3lN0eQaw53hhdhQsGYq8cj3gn8ac68Zt2NX6Tmm1T0yJ+M4Bm90MHBGCnRMy6DN+R3/M8Lz18JbGqK/tt4OUruuT9HAhib8lKXL2yfj8mESneyc0mtxarixtuXoaoT76vmqujxR3F88CAxq1kS9w6w63nUFaBHre65HfsBxbM038YPXI6ZZiTq8B3NCROuClLMulRolSPmx3Af4X8xuwtY1zdWCNOndIjgD4432+DELf5zEdnrvCsPQ16URBMWismPKVFPezVfoQPILtta/zKaYdURbKcOfMpMydSzDe1zHMuIzafH6gha5LIH0+Yz3wqFTKTvKWlnUir2xtXTawlrr0AcMQzy7z6G2jeDFfM210AcCBVpK2KVX39pwCIuj/NmGjWSrMyebmooxbZYAEjYOfHIHKqvczjj4uZvXjxhVP7QTX/zTe3cP8CAQ==';

// Create a style element
let styleButtonPresets = document.createElement('style');
styleButtonPresets.innerHTML = `
/* Frosted glass effect */
#plugin-button-presets button,
.tooltip-presets::after {
  backdrop-filter: blur(5px);
  transition: 0.6s ease background-color;
}

#plugin-button-presets button:hover {
  transition: 0.3s ease background-color;
}

/* Active preset highlight */
#plugin-button-presets button.preset-active {
  background-color: var(--color-2-transparent) !important;
  outline: 2px solid var(--color-5-transparent) !important;
  outline-offset: 0;
  box-shadow: 0 0 10px var(--color-3-transparent);
}

#plugin-button-presets button.preset-active:hover {
  background-color: var(--color-4) !important;
}

#plugin-button-presets button img {
  transition: transform 0.2s ease, opacity 0.3s ease-out !important;
  transform: scale(1);
}

#plugin-button-presets button:hover img {
  transition: transform 0.2s ease, opacity 0.3s ease-out !important;
  transform: scale(1.05);
}

/* Tooltip styling */
.tooltip-presets {
  position: relative;
  flex-grow: 0.1;
  margin: 0 4px;
}
@media (max-width: 768px) {
  .tooltip-presets {
    overflow: hidden;
  }
}

.tooltip-presets::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
  padding: 5px 25px;
  background-color: var(--color-3-transparent);
  border: 2px solid var(--color-3);
  color: var(--color-text);
  border-radius: 15px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s;
  pointer-events: none;
  text-align: center;
  font-size: 14px;
  z-index: 1;
}

.tooltip-presets:hover::after {
  opacity: 1;
  visibility: visible;
}

.tooltip-presets[data-tooltip=""]::after {
  display: none;
}

/* Media Queries */

/* Preserve bottom margin (panels.css:93) */
@media only screen and (min-width: 960px) and (max-height: 860px) {
  #plugin-button-presets {
    /* padding-right: 8px; */ /* Not needed for FM-DX Webserver v1.3.5+ */
  }

  /* Fix spacing when chat is enabled */
  .wrapper-outer #wrapper .flex-container .panel-10.no-bg.m-0 {
    padding-bottom: 0;
  }

  .wrapper-outer #wrapper .flex-container .panel-10.no-bg.m-0 .panel-10.no-bg.h-100 {
    height: 80px !important;
  }
}

/* Add spacing below bottom containers */
@media only screen and (min-width: 768px) {
  #plugin-button-presets {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .button-text {
    font-size: 14px;
  }
}

/* Mobile device spacing */
@media only screen and (max-width: 480px) {
  #plugin-button-presets {
    margin-bottom: 40px;
  }
}

/* Prevent cropped text on mobile */
@media only screen and not (min-width: 960px) {
  #plugin-button-presets button {
    padding: 4px !important;
  }
}

/* Force hide dropdown menu in portrait mode */
@media only screen and (max-width: 768px) {
  #button-presets-bank-dropdown,
  #button-presets-info-icon-container {
    display: none !important;
  }
}

@media only screen and (min-height: 861px) {
  .button-presets {
    margin-top: 20px;
  }
}

/* Adjustments for screen width */
@media only screen and (max-width: 800px) {
  .button-presets {
    margin-bottom: 40px;
  }

  #button-preset-ps {
    font-size: 0.8em;
  }
}

/* Correct tooltips for mobile devices in portrait mode */
@media only screen and (max-width: 480px) {
  #setFrequencyButton5::after,
  #setFrequencyButton6::after,
  #setFrequencyButton7::after,
  #setFrequencyButton8::after,
  #setFrequencyButton9::after {
    top: 120%;
    bottom: inherit !important;
  }
}

/* Import/Export buttons */
#plugin-button-presets {
    position: relative;
}
#import-button-preset,
#export-button-preset {
  opacity: .48;
  transition: opacity 0.8s !important;
}
#import-button-preset:hover,
#export-button-preset:hover {
  opacity: .96;
  transition: opacity 0.8s !important;
}

.w-50 {
    min-width: 50px !important;
}

/* Move import/export if not enough width */
@media only screen and (max-width: 1300px) {
  #export-button-preset,
  #import-button-preset {
   left: -8px;
  }
}

/* 30+ button display */
#plugin-button-presets.button-presets {
  display: flex;
  flex-wrap: wrap;
}

/* 2 rows of 5 buttons for low resolution */
@media screen and (max-width: 728px) {
    #plugin-button-presets {
      display: grid !important;
      padding: 0;
      grid-template-columns: repeat(5, 16%);
        @media screen and (max-width: 440px) {
          padding: 0 60px 0 60px;
          grid-template-columns: repeat(5, 1fr);
        }
    }
    #plugin-button-presets.button-presets button[id^="setFrequencyButton"] {
        width: calc(100% - 12px) !important;
    }
}
.preset-default span.button-text {
  color: var(--color-main-bright)!important;
}
`;
// Append the style to the head of the document
document.head.appendChild(styleButtonPresets);

// 30+ button display
function bankDisplayAllGap() {
  if (bankDisplayAll) {
      const styleElement = document.createElement('style');
      styleElement.textContent = `
          #plugin-button-presets.button-presets {
              gap: 8px !important;
          }
      `;
      document.head.appendChild(styleElement);
  } else {
      const styleElement = document.createElement('style');
      styleElement.textContent = `
          #plugin-button-presets.button-presets {
              gap: 4px !important;
          }
      `;
      document.head.appendChild(styleElement);
  }
}

let tooltipFirstLoad = false;
const DISPLAY_KEY_ButtonPresets = 'buttonPresetsHidden';
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

// Create a container for the buttons
let buttonContainer = document.createElement("div");
buttonContainer.id = "plugin-button-presets";
buttonContainer.classList.add('button-presets', 'flex-container', 'flex-center', 'show-phone');
buttonContainer.style.display = "flex";
buttonContainer.style.flexWrap = "wrap";
buttonContainer.style.gap = "4px";
buttonContainer.style.marginLeft = "6px";
buttonContainer.style.marginRight = "6px";

// Function to get stored button values, data-ps values, and images from localStorage
function getStoredData(bank) {
  const key = `buttonPresets${bank}`;
  let dataButtonPresets;
  if (bank === "A") {
    dataButtonPresets = JSON.parse(localStorage.getItem(key)) || { values: [...defaultPresetData.values], antennas: [...defaultPresetData.antennas], ps: [...defaultPresetData.names], images: [...defaultPresetData.urls] };
  } else {
    dataButtonPresets = JSON.parse(localStorage.getItem(key)) || { values: Array(10).fill(87.3), antennas: Array(10).fill(''), ps: Array(10).fill(''), images: Array(10).fill('') };
  }
  const favoriteFrequencies = JSON.parse(localStorage.getItem('favoriteFrequencies')) || [];
  const localFavoriteFrequencies = [
    ...favoriteFrequencies,
    ...dataButtonPresets.values,
  ]
  const uniqueFavoriteFrequencies = localFavoriteFrequencies.filter((frequency, index, self) => self.indexOf(frequency) === index).slice(0, 10);

  // Sync local storage if difference
  if (JSON.stringify(dataButtonPresets.values) !== JSON.stringify(uniqueFavoriteFrequencies)) {
    dataButtonPresets.values = uniqueFavoriteFrequencies;
    localStorage.setItem(key, JSON.stringify(dataButtonPresets));
  }
  dataButtonPresets.values = uniqueFavoriteFrequencies;
  return dataButtonPresets;
}

// Function to save button values, data-ps values, and images to localStorage
function saveToLocalStorage(bank, buttonValues, antennaValues, psValues, buttonImages, tooltipValues) {
  const sanitizedButtonValues = buttonValues.map(value => value === null ? "" : value);
  const sanitizedAntennaValues = antennaValues.map(value => value === null ? "" : value);
  const sanitizedPsValues = psValues.map(value => value === null ? "" : value);
  const sanitizedButtonImages = buttonImages.map(value => value === null ? "" : value);
  const sanitizedTooltipValues = tooltipValues.map(value => value === null ? "" : value);

  localStorage.setItem(`buttonPresets${bank}`, JSON.stringify({
    values: sanitizedButtonValues,
    antennas: sanitizedAntennaValues,
    ps: sanitizedPsValues,
    images: sanitizedButtonImages,
    tooltips: sanitizedTooltipValues
  }));
}

function resetDefaultPresets(bank) {
  if (!localStorage.getItem('resetDefaultPresetsDone') || localStorage.getItem('resetDefaultPresetsDone') == 0) {
    const key = `buttonPresets${bank}`;
    const dataButtonPresets = JSON.parse(localStorage.getItem(key)) || {};
    const buttonPresets = dataButtonPresets?.values || [];
    const newButtonPresets = buttonPresets.map((fre) => fre === 87.5 ? 87.3 : fre);
    localStorage.setItem(key, JSON.stringify({
      ...dataButtonPresets,
      values: newButtonPresets,
    }));
    localStorage.setItem('resetDefaultPresetsDone', 1);
  }
}

// Default to Bank A
let currentBank = 'A';

// Create a custom dropdown menu
let dropdownContainer = document.createElement('div');
dropdownContainer.classList.add('panel-50', 'w-50', 'no-bg', 'h-100', 'm-0', 'dropdown', 'dropdown-up', 'hide-phone');
dropdownContainer.id = 'button-presets-bank-dropdown'; // Dropdown ID

let dropdownInput = document.createElement('input');
dropdownInput.type = 'text';
dropdownInput.placeholder = `${bankName} A`; // Bank text
dropdownInput.readOnly = true;
dropdownInput.tabIndex = 0;
dropdownContainer.appendChild(dropdownInput);

let dropdownOptions = document.createElement('ul');
dropdownOptions.classList.add('options', 'open-top');
dropdownOptions.tabIndex = -1;
let bankNames;
if (bankQuantity >= 3 && bankQuantity <= 8) {
  bankNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].slice(0, bankQuantity);
} else {
  bankNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].slice(0, 3);
}
bankNames.forEach(bank => {
  let option = document.createElement('li');
  option.classList.add('option');
  option.dataset.value = bank;
  option.tabIndex = 0;
  option.textContent = `${bankName} ${bank}`; // Bank text
  dropdownOptions.appendChild(option);
  resetDefaultPresets(bank);
});
dropdownContainer.appendChild(dropdownOptions);

// Toggle dropdown options visibility
dropdownInput.addEventListener('click', function() {
  dropdownOptions.classList.toggle('opened');
});

// Update bank and input value when an option is selected
dropdownOptions.addEventListener('click', function(event) {
  if (event.target && event.target.matches('li.option')) {
    currentBank = event.target.dataset.value;
    dropdownInput.value = `${bankName} ${currentBank}`; // Bank text
    updateButtons(); // Update the buttons when the bank changes
    dropdownOptions.classList.remove('opened');
    setTimeout(highlightActivePreset, 100);
  }
});

// Function to replace F1-F4 preset buttons
function replacePresets() {
    document.addEventListener("DOMContentLoaded", () => {
        let replaceOriginals;

        const presets = {
            preset1: { bank: "A", label: `${bankName} A` },
            preset2: { bank: "B", label: `${bankName} B` },
            preset3: { bank: "C", label: `${bankName} C` },
            preset4: { bank: "D", label: `${bankName} D` }
        };

        const extraPresets = {
            preset5: { bank: "E", label: `${bankName} E` },
            preset6: { bank: "F", label: `${bankName} F` },
            preset7: { bank: "G", label: `${bankName} G` },
            preset8: { bank: "H", label: `${bankName} H` }
        };

        replaceOriginals = bankMenuLocation === 'top-replace' && localStorage.getItem('preset1') && localStorage.getItem('preset1') !== 'null';

        // Get parent of existing buttons
        const firstButton = document.querySelector('#dashboard-panel-description .flex-container .flex-center #preset1');
        let originalContainer, parentNode;
        if (firstButton) {
            originalContainer = firstButton.parentNode;
            parentNode = originalContainer.parentNode;
        }

        let newContainer1, newContainer2;
        if (!replaceOriginals && originalContainer && parentNode) {
            newContainer1 = document.createElement('div');
            newContainer1.classList.add('flex-center', 'flex-phone');
            newContainer1.style.display = 'flex';
            newContainer1.style.flexWrap = 'wrap';
            newContainer1.style.maxWidth = originalContainer.style.width || '100%';
            parentNode.insertBefore(newContainer1, originalContainer.nextSibling);

            if (bankQuantity === 8) {
                newContainer2 = document.createElement('div');
                newContainer2.classList.add('flex-center', 'flex-phone');
                newContainer2.style.display = 'flex';
                newContainer2.style.flexWrap = 'wrap';
                newContainer2.style.maxWidth = originalContainer.style.width || '100%';
                parentNode.insertBefore(newContainer2, newContainer1.nextSibling);
            }
        }

        Object.entries(presets).forEach(([id, { bank, label }], index) => {
            const button = document.querySelector(`#${id}.no-bg.color-4.hover-brighten`);

            if (button) {
                if (replaceOriginals) {
                    // Style
                    button.addEventListener("click", (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        currentBank = bank;
                        updateButtons();
                        checkImageErrors();
                    }, true);

                    if (bankQuantity === 8 && originalContainer && parentNode && !newContainer1) {
                        newContainer1 = document.createElement('div');
                        newContainer1.classList.add('flex-center', 'flex-phone');
                        newContainer1.style.display = 'flex';
                        newContainer1.style.flexWrap = 'wrap';
                        newContainer1.style.maxWidth = originalContainer.style.width || '100%';
                        parentNode.insertBefore(newContainer1, originalContainer.nextSibling);
                    }

                    if (bankQuantity === 8) {
                        const clonedButton = button.cloneNode(true);
                        const newId = `preset${index + 5}`;
                        // Style
                        clonedButton.id = newId;

                        const clonedSpan = clonedButton.querySelector(`#${id}-text`);
                        if (clonedSpan) {
                            clonedSpan.id = `${newId}-text`;
                            clonedSpan.textContent = extraPresets[newId].label;
                        }

                        newContainer1.appendChild(clonedButton);

                        clonedButton.addEventListener("click", (event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            currentBank = extraPresets[newId].bank;
                            updateButtons();
                        }, true);
                    }
                } else {
                    const newButton = button.cloneNode(true);
                    const newId = `button-${id}`;
                    // Style
                    newButton.id = newId;
                    newButton.style.height = '64px';
                    newButton.style.filter = 'hue-rotate(45deg)';

                    const newSpan = newButton.querySelector(`#${id}-text`);
                    if (newSpan) {
                        newSpan.id = `${newId}-text`;
                        newSpan.textContent = label;
                    }

                    newContainer1 && newContainer1.appendChild(newButton);

                    newButton.addEventListener("click", (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        currentBank = bank;
                        updateButtons();
                    }, true);
                }
            }
        });

        if (!replaceOriginals && bankQuantity === 8) {
            Object.entries(extraPresets).forEach(([id, { bank, label }], index) => {
                const origButton = document.querySelector(`#preset${index + 1}.no-bg.color-4.hover-brighten`);
                if (origButton) {
                    const extraButton = origButton.cloneNode(true);
                    // Style
                    extraButton.id = id;
                    extraButton.style.height = '64px';
                    extraButton.style.filter = 'hue-rotate(45deg)';

                    const extraSpan = extraButton.querySelector(`#preset${index + 1}-text`);
                    if (extraSpan) {
                        extraSpan.id = `${id}-text`;
                        extraSpan.textContent = label;
                    }

                    newContainer2.appendChild(extraButton);

                    extraButton.addEventListener("click", (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        currentBank = bank;
                        updateButtons();
                    }, true);
                }
            });
        }

        Object.entries(presets).forEach(([id, { label }]) => {
            const span = document.querySelector(`#${id}-text`);
            if (span && replaceOriginals) {
                const observer = new MutationObserver((mutations, obs) => {
                    mutations.forEach(mutation => {
                        if (mutation.type === "childList" && span.textContent.trim() !== "") {
                            span.textContent = label;
                            obs.disconnect();
                        }
                    });
                });

                observer.observe(span, { childList: true, subtree: true });

                if (span.textContent.trim() !== "") {
                    span.textContent = label;
                    observer.disconnect();
                }
            }
        });
    });
}

// Insert the dropdown menu before the specified element
let targetElement;
if (bankMenuLocation !== 'hidden' && !bankDisplayAll) {
  if (bankMenuLocation == 'ims') {
    targetElement = document.querySelector('.panel-50.no-bg.br-0.h-100.m-0.button-ims');
  } else if (bankMenuLocation == 'bw') {
    targetElement = document.querySelector('#data-bw.panel-50');
  } else if (bankMenuLocation == 'ant') {
    targetElement = document.querySelector('#data-ant.panel-50');
  } else if (bankMenuLocation == 'eq') {
    targetElement = document.querySelector('.panel-50.no-bg.br-0.h-100.m-0.button-eq');
  } else if (bankMenuLocation == 'top' || bankMenuLocation == 'top-replace') {
    replacePresets();
  }
}

if (targetElement) {
  
  dropdownContainer.style.setProperty('margin-left', bankMenuPaddingLeft + 'px', 'important');
  dropdownContainer.style.setProperty('margin-right', bankMenuPaddingRight + 'px', 'important');
  
  if (!bankMenuBorderLeftRadius) {
    dropdownContainer.querySelector('input').style.setProperty('border-top-left-radius', '0px');
    dropdownContainer.querySelector('input').style.setProperty('border-bottom-left-radius', '0px');
  }
  
  if (!bankMenuBorderRightRadius) {
    dropdownContainer.querySelector('input').style.setProperty('border-top-right-radius', '0px');
    dropdownContainer.querySelector('input').style.setProperty('border-bottom-right-radius', '0px');
  }
  
  if (bankMenuCustomWidth !== 'default') {
    dropdownContainer.style.width = bankMenuCustomWidth;
  }
  
  if (bankMenuPosition == 'before') {
    targetElement.parentNode.insertBefore(dropdownContainer, targetElement);
  } else {
    targetElement.parentNode.insertBefore(dropdownContainer, targetElement.nextSibling);
  }
}

// Optional: Hide dropdown menu when clicking outside
document.addEventListener('click', function(event) {
  if (!dropdownContainer.contains(event.target)) {
    dropdownOptions.classList.remove('opened');
  }
});

// Define the getTooltipValue function outside updateButtons
function getTooltipValue() {
  const dataStationNameElement = document.getElementById('data-station-name');
  const dataPsElement = document.getElementById('data-ps');

  // Check if #data-station-name exists and is visible
  if (dataStationNameElement && dataStationNameElement.offsetParent !== null) {
    return dataStationNameElement.textContent.trim();
  }

  // Fallback to #data-ps if #data-station-name doesn't exist or isn't visible
  return dataPsElement ? dataPsElement.textContent.trim() : '';
}

// Function to get the current antenna value
function getCurrentAntennaValue() {
  const dataAntInput = document.querySelector('.data-ant input');
  if (dataAntInput) {
    const currentAntennaText = dataAntInput.value || dataAntInput.placeholder;
    // Find the option that matches the current text
    const options = document.querySelectorAll('.data-ant li.option');
    for (let option of options) {
      if (option.textContent.trim() === currentAntennaText.trim()) {
        return !optionSaveAntenna ? '0' : (option.getAttribute('data-value') || '0');
      }
    }
  }
  return '0'; // Default antenna value
}

// Update buttons on orientation change
function updateButtonsDelayed() {
  setTimeout(updateButtons, 200);
  setTimeout(checkImageErrors, 200);
}

// Update buttons based on the selected bank
function updateButtons() {
  buttonContainer.innerHTML = ''; // Clear existing buttons
  // 30+ button display
  let buttonRows = 1;

  if (bankDisplayAll) {
    buttonRows = bankQuantity || 3;
  } else {
    buttonRows = 1;
  }

  for (let iAll = 0; iAll < buttonRows; iAll++) {
    // 30+ button display
    if (bankDisplayAll) {
      if (iAll >= 0 && iAll < bankQuantity) {
        currentBank = bankNames[iAll];
      } else {
        currentBank = '';
      }
    }

    let storedData = getStoredData(currentBank);
    let buttonValues = storedData.values || [];
    let antennaValues = storedData.antennas || [];
    let psValues = storedData.ps || [];
    let buttonImages = storedData.images || [];
    let tooltipValues = storedData.tooltips || [];

    for (let i = 0; i < 10; i++) {
      (function(index, buttonBank) {
        let button = document.createElement("button");
        const buttonId = bankDisplayAll ? `setFrequencyButton${buttonBank}${index}` : `setFrequencyButton${index}`;
        button.id = buttonId; // Create unique IDs for "Show All Presets"
        const favoriteFrequencies = JSON.parse(localStorage.getItem('favoriteFrequencies')) || [];
        const isDefault = (favoriteFrequencies[index] || favoriteFrequencies.includes(buttonValues[index]));
        button.classList.add('tooltip-presets', 'tooltip-presets-once', isDefault ? 'preset-default' : 'preset-local');
        button.setAttribute('data-tooltip', tooltipValues[index] || psValues[index]); // Tooltip uses data-station-name if available, otherwise psValue
        button.style.minWidth = "60px";
        button.style.width = "8%";
        button.style.height = "48px";
        
        updateButton(button, buttonValues[index], index);
        
        if (!isIOS) {
          // Default button handling
          button.addEventListener('click', function() {
            let commandInput = document.getElementById('commandinput');
            const presetInput = buttonValues[index];
            const antennaInput = antennaValues[index];

            if (socket.readyState === WebSocket.OPEN) {
              socket.send("T" + (Math.round((presetInput).toFixed(3) * 1000)));
              if (optionSaveAntenna && antennaInput && antennaInput !== getCurrentAntennaValue()) socket.send("Z" + antennaInput);
            }

            // Update current preset tracking for keyboard navigation
            currentPresetIndex = index;
            currentPresetBank = buttonBank;
            lastUsedPreset = {bank: buttonBank, index: index};
            checkBankASum();

            setTimeout(highlightActivePreset, 200);
          });
          
          button.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            let dataFrequencyElement = document.getElementById('data-frequency');
            let dataPsElement = document.getElementById('data-ps');
            let dataStationNameElement = document.getElementById('data-station-name');
            let dataFrequency = dataFrequencyElement ? dataFrequencyElement.textContent : '87.3';
            let dataPs = dataPsElement ? dataPsElement.textContent : '';
            let tooltipValue = (dataStationNameElement && dataStationNameElement.offsetParent !== null) ? dataStationNameElement.textContent : dataPs;
            
            buttonValues[index] = parseFloat(dataFrequency) || 87.3;
            // prevent save override to favorite frequencies from server
            const favoriteFrequencies = JSON.parse(localStorage.getItem('favoriteFrequencies')) || [];
            if (favoriteFrequencies[index] || favoriteFrequencies.includes(buttonValues[index])) {
              return;
            }
            antennaValues[index] = getCurrentAntennaValue();
            psValues[index] = dataPs;
            tooltipValues[index] = tooltipValue;
            buttonImages[index] = getImageSrc();
            updateButton(button, buttonValues[index], index);
            checkBankASum();
            if (typeof sendToast === 'function') {
                let antennaToast = optionSaveAntenna 
                    ? ` (Ant ${optionAntennaDisplay === 'letter' ? String.fromCharCode(65 + Number(getCurrentAntennaValue())) : Number(getCurrentAntennaValue()) + 1})` 
                    : '';
                sendToast('info', t('toast.presetButtons'), `${t('common.frequency')} <strong>${buttonValues[index]} MHz${antennaToast}</strong> ${t('toast.savedToPresetBlank')} <b>${currentBank}</b>, button <b>#${(index + 1)}</b>.`, false, false);
            }
            console.log(`[${pluginName}] Preset saved:`, buttonValues[index] + ` (${getCurrentAntennaValue()})`, currentBank, (index + 1));
          });
        } else {
          // iOS button handling
          let longPressTimer;
          const LONG_PRESS_THRESHOLD = 500; // Long press functionality
          
          button.addEventListener('mousedown', function(e) {
              e.preventDefault();
              longPressTimer = setTimeout(() => {
                  savePreset();
              }, LONG_PRESS_THRESHOLD);
          });
          
          button.addEventListener('mouseup', function(e) {
              clearTimeout(longPressTimer);
              if (!e.defaultPrevented) {
                  recallPreset();
              }
          });
          
          button.addEventListener('touchstart', function(e) {
              e.preventDefault();
              longPressTimer = setTimeout(() => {
                  savePreset();
              }, LONG_PRESS_THRESHOLD);
          });
          
          button.addEventListener('touchend', function(e) {
              clearTimeout(longPressTimer);
              if (!e.defaultPrevented) {
                  recallPreset();
              }
          });
          
          function savePreset() {
            let dataFrequencyElement = document.getElementById('data-frequency');
            let dataPsElement = document.getElementById('data-ps');
            let dataStationNameElement = document.getElementById('data-station-name');
            let dataFrequency = dataFrequencyElement ? dataFrequencyElement.textContent : '87.3';
            let dataPs = dataPsElement ? dataPsElement.textContent : '';
            let tooltipValue = (dataStationNameElement && dataStationNameElement.offsetParent !== null) ? dataStationNameElement.textContent : dataPs;
            
            buttonValues[index] = parseFloat(dataFrequency) || 87.3;
            antennaValues[index] = getCurrentAntennaValue();
            psValues[index] = dataPs;
            tooltipValues[index] = tooltipValue;
            buttonImages[index] = getImageSrc();
            updateButton(button, buttonValues[index], index);
            checkBankASum();
            if (typeof sendToast === 'function') {
                let antennaToast = optionSaveAntenna 
                    ? ` (Ant ${optionAntennaDisplay === 'letter' ? String.fromCharCode(65 + Number(getCurrentAntennaValue())) : Number(getCurrentAntennaValue()) + 1})` 
                    : '';
                sendToast('info', t('toast.presetButtons'), `${t('common.frequency')} <strong>${buttonValues[index]} MHz${antennaToast}</strong> ${t('toast.savedToPresetBlank')} <b>${currentBank}</b>, button <b>#${(index + 1)}</b>.`, false, false);
            }
            console.log(`[${pluginName}] Preset saved:`, buttonValues[index] + ` (${getCurrentAntennaValue()})`, currentBank, (index + 1));
          }
          
          function recallPreset() {
            let commandInput = document.getElementById('commandinput');
            const presetInput = buttonValues[index];
            const antennaInput = antennaValues[index];

            if (socket.readyState === WebSocket.OPEN) {
              socket.send("T" + (Math.round((presetInput).toFixed(3) * 1000)));
              if (optionSaveAntenna && antennaInput && antennaInput !== getCurrentAntennaValue()) socket.send("Z" + antennaInput);
            }

            // Update current preset tracking for keyboard shortcuts
            currentPresetIndex = index;
            currentPresetBank = buttonBank;
            lastUsedPreset = {bank: buttonBank, index: index};
            checkBankASum();

            setTimeout(highlightActivePreset, 10);
          }
        }
        
        // Handle keyboard events for SHIFT + S and SHIFT + R
        document.addEventListener('keydown', function(e) {
          let isButtonFocused = document.activeElement === button;

          if (isButtonFocused) {
            if (e.shiftKey && e.key === 'S') {
              // SHIFT + S key combination
              let dataFrequencyElement = document.getElementById('data-frequency');
              let dataPsElement = document.getElementById('data-ps');
              let dataFrequency = dataFrequencyElement ? dataFrequencyElement.textContent : '87.3';
              let dataPs = dataPsElement ? dataPsElement.textContent : '';
              
              buttonValues[index] = parseFloat(dataFrequency) || 87.3;
              antennaValues[index] = getCurrentAntennaValue();
              psValues[index] = dataPs;
              buttonImages[index] = getImageSrc();
              tooltipValues[index] = getTooltipValue() || ''; // Ensures tooltipValue is not null
              updateButton(button, buttonValues[index], index);
              checkBankASum();
            } else if (e.shiftKey && e.key === 'R') {
              // SHIFT + R key combination
              buttonValues[index] = 87.3;
              antennaValues[index] = '';
              psValues[index] = '';
              buttonImages[index] = '';
              tooltipValues[index] = ''; // Reset the tooltip value as well
              updateButton(button, buttonValues[index], index);
              checkBankASum();
            }
          }
        });

        // Handle mouse events
        button.addEventListener('mousedown', function(e) {
          if (e.button === 1 || e.ctrlKey || (e.shiftKey && e.button === 0)) {
            if (e.button === 1 || (e.shiftKey && e.button === 0)) {
              buttonValues[index] = 87.3;
              antennaValues[index] = '';
              psValues[index] = '';
              buttonImages[index] = '';
              tooltipValues[index] = ''; // Reset the tooltip value as well
            } else if (e.ctrlKey) {
              let dataFrequencyElement = document.getElementById('data-frequency');
              let dataPsElement = document.getElementById('data-ps');
              let dataFrequency = dataFrequencyElement ? dataFrequencyElement.textContent : '87.3';
              let dataPs = dataPsElement ? dataPsElement.textContent : '';
              
              buttonValues[index] = parseFloat(dataFrequency) || 87.3;
              antennaValues[index] = getCurrentAntennaValue();
              psValues[index] = dataPs;
              buttonImages[index] = getImageSrc();
              tooltipValues[index] = getTooltipValue() || ''; // Ensures tooltipValue is not null
            }
            updateButton(button, buttonValues[index], index);
            checkBankASum();
          }
        });
        
        function updateButton(button, value, index) {
          const antennaInput = antennaValues[index];
          const psValue = psValues[index] || ''; // Ensure psValue is always used for button text
          const tooltipValue = tooltipValues[index] || psValue; // Fallback to psValue if tooltipValue is undefined
          const imageSrc = (buttonImages && buttonImages[index]) || ''; // Ensure imageSrc is a valid string
          const padding = "6px";
          let antennaButton = antennaInput && optionSaveAntenna
              ? window.innerWidth > 1080
                  ? `<span class="fa-solid fa-tower-broadcast" style="font-size: 9px; position: absolute; top: 1px; margin-left: 4px; white-space: nowrap; overflow: hidden; display: inline-block;"></span><span style="font-size: 10px; position: absolute; top: -1px; margin-left: 16px; white-space: nowrap; overflow: hidden; display: inline-block;">${optionAntennaDisplay === 'letter' ? String.fromCharCode(65 + Number(antennaInput)) : Number(antennaInput) + 1}</span>`
                  : `<span style="font-size: 10px; position: absolute; top: -1px; margin-left: 1px; white-space: nowrap; overflow: hidden; display: inline-block;">${optionAntennaDisplay === 'letter' ? String.fromCharCode(65 + Number(antennaInput)) : Number(antennaInput) + 1}</span>`
              : '';
          const displayText = `${formatValue(value).trim()}${antennaButton}<span id="button-preset-ps" style="display: block; margin-top: -2px; white-space: nowrap; overflow: hidden; font-weight: 500;">${psValue.trim()}</span>`;
          let paddingMobile;
          
          button.style.position = "relative"; // Ensure button is positioned to contain the image
          button.style.padding = padding;
          button.style.backgroundColor = 'var(--color-1-transparent)';
          
          // Remove existing image if present
          const existingImg = button.querySelector('img');
          if (existingImg) {
            button.removeChild(existingImg);
          }
          
          // Remove existing text if present
          const existingText = button.querySelector('.button-text');
          if (existingText) {
            button.removeChild(existingText);
          }
          
          // Append the image if it exists
          if (imageSrc) {
            const img = document.createElement('img');
            img.src = imageSrc || defaultButtonPresetImagePath;
            img.style.position = "absolute";
            img.style.top = padding;
            img.style.left = padding;
            img.style.right = padding;
            img.style.bottom = padding;
            img.style.width = `calc(100% - ${padding} * 2)`;
            img.style.height = `calc(100% - ${padding} * 2)`;
            img.style.objectFit = "contain";
            img.style.transition = "opacity 0.8s";
            img.style.borderRadius = "6px";
            button.style.userSelect = 'none';
            button.appendChild(img);
            
            // Create and append the text element
            const textElement = document.createElement('span');
            textElement.className = 'button-text';
            textElement.innerHTML = displayText;
            textElement.style.position = "absolute";
            textElement.style.top = padding;
            textElement.style.left = padding;
            textElement.style.right = padding;
            textElement.style.bottom = padding;
            textElement.style.visibility = "hidden";
            textElement.style.color = "var(--color-text)";
            if (window.location.pathname !== '/setup') textElement.style.fontFamily = window.getComputedStyle(document.getElementById('data-ps')).fontFamily;
            button.appendChild(textElement);
            
            // Add hover effect for image and text
            button.addEventListener('mouseover', function() {
              button.style.backgroundColor = 'var(--color-4-transparent)';
              img.style.opacity = "0.1";
              textElement.style.visibility = "visible"; // Show text on hover
            });
            button.addEventListener('mouseout', function() {
              button.style.backgroundColor = 'var(--color-1-transparent)';
              img.style.opacity = "1"; // Reset opacity when not hovered
              textElement.style.visibility = "hidden"; // Hide text when not hovered
            });
          } else {
            if (displayDefaultLogo && window.matchMedia("(max-width: 860px) and (orientation: portrait)").matches) {
              paddingMobile = "0px";
            } else {
              paddingMobile = "-8px"; // Default or landscape mode padding
            }
            
            // Event listener for orientation change
            document.addEventListener("DOMContentLoaded", function () {
                function debounce(func, wait) {
                    let timeout;
                    return function(...args) {
                        clearTimeout(timeout);
                        timeout = setTimeout(() => func.apply(this, args), wait);
                    };
                }
                
                const debouncedUpdateButtons = debounce(updateButtonsDelayed, 400);
                
                // Add debounced event listener for orientationchange
                window.addEventListener('orientationchange', debouncedUpdateButtons);
            });
            
            // Display default logo
            if (displayDefaultLogo) {
              const paddingDefaultLogo = paddingMobile;
              const img = document.createElement('img');
              img.src = imageSrc || defaultButtonPresetImagePath;
              img.style.position = "absolute";
              
              if (enableDefaultLogo !== 'all' && (enableDefaultLogo === 'unnamed' && psValues[index]) || (enableDefaultLogo === 'named' && !psValues[index])) {
                img.style.opacity = "0";
              } else {
                img.style.opacity = "0.12";
                
                // Add hover effect for image and text
                button.addEventListener('mouseover', function() {
                  button.style.backgroundColor = 'var(--color-4-transparent)';
                  img.style.opacity = "0.08";
                  textElement.style.visibility = "visible"; // Show text on hover
                });
                button.addEventListener('mouseout', function() {
                  button.style.backgroundColor = 'var(--color-1-transparent)';
                  img.style.opacity = "0.12"; // Reset opacity when not hovered
                });
              }
              
              img.style.top = paddingDefaultLogo;
              img.style.left = paddingDefaultLogo;
              img.style.right = paddingDefaultLogo;
              img.style.bottom = paddingDefaultLogo;
              img.style.width = `calc(100% - ${paddingDefaultLogo} * 2)`;
              img.style.height = `calc(100% - ${paddingDefaultLogo} * 2)`;
              img.style.objectFit = "contain";
              img.style.transition = "opacity 0.8s";
              img.style.borderRadius = "0px";
              button.style.userSelect = 'none';
              button.appendChild(img);
              
              img.addEventListener('mousedown', (e) => {
                if (e.button === 0) {
                      e.preventDefault(); // Prevent the default drag behavior
                  }
              });
            }
            
            // If no image, ensure text is visible and positioned correctly
            const textElement = document.createElement('span');
            textElement.className = 'button-text';
            textElement.innerHTML = displayText;
            textElement.style.position = "relative";
            textElement.style.color = "var(--color-text)";
            textElement.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.8)';
            if (window.location.pathname !== '/setup') textElement.style.fontFamily = window.getComputedStyle(document.getElementById('data-ps')).fontFamily;
            button.appendChild(textElement);
            
            // Add hover effect for buttons without an image
            button.addEventListener('mouseover', function() {
              button.style.backgroundColor = 'var(--color-4-transparent)';
            });
            button.addEventListener('mouseout', function() {
              button.style.backgroundColor = 'var(--color-1-transparent)';
            });
          }
          
          button.setAttribute('data-tooltip', tooltipValue.trim());
          // 30+ button display
          if (bankDisplayAll) {
            if (iAll >= 0 && iAll < bankQuantity) {
              currentBank = bankNames[iAll];
            } else {
              currentBank = '';
            }
          }
          saveToLocalStorage(currentBank, buttonValues, antennaValues, psValues, buttonImages, tooltipValues);
        }
        
        function formatValue(value) {
          if (value === undefined) {
            value = 87.3;
          }

          //   0-27 MHz : 3 decimal places
          //  27-76 MHz : 2 decimal places
          // 76-108 MHz : 1 decimal place
          let fixedValue;

          if (!value || isNaN(Number(value))) {
            value = 87.3;
          }
          switch (true) {
            case (value <= 27):
              fixedValue = value.toFixed(4);
              break;
            case (value > 27 && value < 76):
              fixedValue = value.toFixed(3);
              break;
            case (value >= 76 && value <= 108):
              fixedValue = value.toFixed(2);
              break;
            default:
              fixedValue = value.toFixed(3);
          }

          return fixedValue.endsWith('0') ? fixedValue.slice(0, -1) : fixedValue;
        }
        
        // Function to determine if the image is local or external
        function isImageLocal(imageUrl) {
          try {
            const imageUrlObj = new URL(imageUrl);
            const siteOrigin = window.location.origin;
            return imageUrlObj.origin === siteOrigin;
          } catch (e) {
            // Handle the case where the URL might be invalid or not absolute
            return false;
          }
        }
        
        // Function to get the image source and determine if it’s local or external
        function getImageSrc() {
          const logoImg = null;
          if (logoImg && logoImg.src && !logoImg.src.startsWith('data:image/png;base64') && !logoImg.src.startsWith('data:image/webp;base64') && !logoImg.src.includes('default')) {
            const imageUrl = logoImg.src;
            if (isImageLocal(imageUrl)) {
              // Handle local image
              return new URL(imageUrl).pathname; // Store only the path
            } else {
              // Handle external image
              return imageUrl; // Store the full URL
            }
          }
          return '';
        }
        
        buttonContainer.appendChild(button);
      })(i, currentBank);
    } // i
  } // iAll
  createImportExportButtons();

  // Highlight if lastUsedPreset and correct bank
  if (!lastUsedPreset || (lastUsedPreset && lastUsedPreset.bank === currentBank)) {
    setTimeout(highlightActivePreset, 200);
  }
}

// Set default bank to A and update buttons on load
currentBank = 'A';
updateButtons();

setInterval(() => {
  updateButtons();
}, 30*1000);

// Keyboard preset navigation
startFrequencyMonitoring();

// Function to initialise keyboard navigation from highlighted preset on page load
function initialiseKeyboardNavigation() {
  const container = document.getElementById('plugin-button-presets');
  if (!container) {
    setTimeout(initialiseKeyboardNavigation, 100);
    return;
  }

  const initializeFromHighlighted = () => {
    const highlightedButtons = container.querySelectorAll('button.preset-active');

    if (highlightedButtons.length > 0) {
      // Use first highlighted button if multiple exist
      const firstHighlighted = highlightedButtons[0];
      const buttonId = firstHighlighted.id;

      if (bankDisplayAll) {
        // In "Show All Presets" mode, extract bank and index from ID
        const match = buttonId.match(/setFrequencyButton([A-Z])(\d+)/);
        if (match) {
          currentPresetBank = match[1];
          currentPresetIndex = parseInt(match[2]);
          console.log(`[${pluginName}] Keyboard navigation initialised from highlighted preset: ${currentPresetBank}${currentPresetIndex + 1}`);
        }
      } else {
        // In single bank mode, extract index from ID
        const match = buttonId.match(/setFrequencyButton(\d+)/);
        if (match) {
          currentPresetIndex = parseInt(match[1]);
          currentPresetBank = currentBank;
          console.log(`[${pluginName}] Keyboard navigation initialised from highlighted preset: ${currentPresetBank}${currentPresetIndex + 1}`);
        }
      }
      return true; // Success
    }
    return false; // No highlighted presets found
  };

  const waitForButtons = () => {
    const allButtons = container.querySelectorAll('button');
    if (allButtons.length === 0) {
      setTimeout(waitForButtons, 50);
      return;
    }

    if (initializeFromHighlighted()) {
      return; // Found highlighting
    }

    const observer = new MutationObserver(() => {
      if (initializeFromHighlighted()) {
        observer.disconnect();
      }
    });

    observer.observe(container, {
      attributes: true,
      attributeFilter: ['class'],
      subtree: true
    });

    setTimeout(() => {
      observer.disconnect();
    }, 2000);
  };

  waitForButtons();
}

initialiseKeyboardNavigation();

// Function to get all visible presets in order
function getAllVisiblePresets() {
  const presets = [];

  if (bankDisplayAll) {
    // In "Show All Presets" mode, collect presets from all banks
    for (let bankIndex = 0; bankIndex < bankQuantity; bankIndex++) {
      const bank = bankNames[bankIndex];
      const storedData = getStoredData(bank);
      const buttonValues = storedData.values || [];

      for (let presetIndex = 0; presetIndex < 10; presetIndex++) {
        presets.push({
          bank: bank,
          index: presetIndex,
          frequency: buttonValues[presetIndex] || 87.3,
          buttonId: `setFrequencyButton${bank}${presetIndex}`
        });
      }
    }
  } else {
    // In single bank mode, only current bank presets
    const storedData = getStoredData(currentBank);
    const buttonValues = storedData.values || [];

    for (let presetIndex = 0; presetIndex < 10; presetIndex++) {
      presets.push({
        bank: currentBank,
        index: presetIndex,
        frequency: buttonValues[presetIndex] || 87.3,
        buttonId: `setFrequencyButton${presetIndex}`
      });
    }
  }

  return presets;
}

// Find current preset position
function getCurrentPresetPosition() {
  const allPresets = getAllVisiblePresets();

  for (let i = 0; i < allPresets.length; i++) {
    if (allPresets[i].bank === currentPresetBank && allPresets[i].index === currentPresetIndex) {
      return i;
    }
  }

  return 0; // Default if not found
}

// Function to get next preset
function getNextPreset() {
  const allPresets = getAllVisiblePresets();
  const currentPosition = getCurrentPresetPosition();
  const nextPosition = (currentPosition + 1) % allPresets.length;
  return allPresets[nextPosition];
}

// Function to get previous preset
function getPreviousPreset() {
  const allPresets = getAllVisiblePresets();
  const currentPosition = getCurrentPresetPosition();
  const prevPosition = (currentPosition - 1 + allPresets.length) % allPresets.length;
  return allPresets[prevPosition];
}

// Function to recall preset by index
function recallPresetByIndex(index) {
  const storedData = getStoredData(currentBank);
  const buttonValues = storedData.values;
  const antennaValues = storedData.antennas || [];

  if (buttonValues && buttonValues[index] !== undefined) {
    const presetInput = buttonValues[index];
    const antennaInput = antennaValues[index];

    if (socket.readyState === WebSocket.OPEN) {
      socket.send("T" + (Math.round((presetInput).toFixed(3) * 1000)));
      if (optionSaveAntenna && antennaInput && antennaInput !== getCurrentAntennaValue()) socket.send("Z" + antennaInput);
    }

    currentPresetIndex = index;
    checkBankASum();

    console.log(`[${pluginName}] Keyboard shortcut:`, presetInput, currentBank, (index + 1));
  }
}

// Function to navigate to next preset
function navigateToNextPreset() {
  if (!hasUsedKeyboardNavigation) {
    // Check if any preset is highlighted
    const highlightedPresets = document.querySelectorAll('#plugin-button-presets button.preset-active');

    if (highlightedPresets.length === 0) {
      hasUsedKeyboardNavigation = true;
      const currentPreset = {
        bank: currentPresetBank,
        index: currentPresetIndex,
        buttonId: bankDisplayAll ? `setFrequencyButton${currentPresetBank}${currentPresetIndex}` : `setFrequencyButton${currentPresetIndex}`
      };
      recallPreset(currentPreset);
      return;
    } else {
      hasUsedKeyboardNavigation = true;
    }
  }

  const nextPreset = getNextPreset();
  recallPreset(nextPreset);
}

// Function to navigate to previous preset
function navigateToPreviousPreset() {
  if (!hasUsedKeyboardNavigation) {
    // Check if any preset is highlighted
    const highlightedPresets = document.querySelectorAll('#plugin-button-presets button.preset-active');

    if (highlightedPresets.length === 0) {
      hasUsedKeyboardNavigation = true;
      const currentPreset = {
        bank: currentPresetBank,
        index: currentPresetIndex,
        buttonId: bankDisplayAll ? `setFrequencyButton${currentPresetBank}${currentPresetIndex}` : `setFrequencyButton${currentPresetIndex}`
      };
      recallPreset(currentPreset);
      return;
    } else {
      hasUsedKeyboardNavigation = true;
    }
  }

  const prevPreset = getPreviousPreset();
  recallPreset(prevPreset);
}

// Function to recall preset by preset object
function recallPreset(preset) {
  const storedData = getStoredData(preset.bank);
  const buttonValues = storedData.values;
  const antennaValues = storedData.antennas || [];

  if (buttonValues && buttonValues[preset.index] !== undefined) {
    const presetInput = buttonValues[preset.index];
    const antennaInput = antennaValues[preset.index];

    if (socket.readyState === WebSocket.OPEN) {
      socket.send("T" + (Math.round((presetInput).toFixed(3) * 1000)));
      if (optionSaveAntenna && antennaInput && antennaInput !== getCurrentAntennaValue()) socket.send("Z" + antennaInput);
    }

    // Update current preset tracking
    currentPresetIndex = preset.index;
    currentPresetBank = preset.bank;
    lastUsedPreset = {bank: preset.bank, index: preset.index};
    checkBankASum();

    const dataFrequencyElement = document.getElementById('data-frequency');
    if (!dataFrequencyElement) return;
    const currentFrequency = parseFloat(dataFrequencyElement.textContent) || 0;

    if (currentFrequency === presetInput) setTimeout(highlightActivePreset, 10);

    console.log(`[${pluginName}] Keyboard shortcut:`, presetInput, preset.bank, (preset.index + 1));
  }
}

// Function to highlight preset that matches current frequency
function highlightActivePreset() {
  const dataFrequencyElement = document.getElementById('data-frequency');
  if (!optionHighlightSelectedPreset || !dataFrequencyElement) return;

  const currentFrequency = parseFloat(dataFrequencyElement.textContent) || 0;

  // Remove existing active class from all buttons
  const allButtons = document.querySelectorAll('#plugin-button-presets button');
  allButtons.forEach(btn => btn.classList.remove('preset-active'));

  // Highlight correct preset
  if (lastUsedPreset) {
    const lastPresetData = getStoredData(lastUsedPreset.bank);
    if (lastPresetData.values && lastPresetData.values[lastUsedPreset.index] !== undefined) {
      const lastPresetFreq = parseFloat(lastPresetData.values[lastUsedPreset.index]) || 0;

      if (Math.abs(currentFrequency - lastPresetFreq) < 0.001) {
        const buttonId = bankDisplayAll ?
          `setFrequencyButton${lastUsedPreset.bank}${lastUsedPreset.index}` :
          `setFrequencyButton${lastUsedPreset.index}`;
        const button = document.getElementById(buttonId);
        if (button) {
          button.classList.add('preset-active');
        }
        return; // Exit early
      }
    }
  }

  // Highlight all matching presets if no last used preset matched current frequency
  if (bankDisplayAll) {
    // In "Show All Presets" mode, check all banks
    for (let bankIndex = 0; bankIndex < bankQuantity; bankIndex++) {
      const bank = bankNames[bankIndex];
      const storedData = getStoredData(bank);
      const buttonValues = storedData.values || [];

      for (let i = 0; i < buttonValues.length && i < 10; i++) {
        const presetFreq = parseFloat(buttonValues[i]) || 0;

        // Check if frequencies match
        if (Math.abs(currentFrequency - presetFreq) < 0.001) {
          const button = document.getElementById(`setFrequencyButton${bank}${i}`);
          if (button) {
            button.classList.add('preset-active');
          }
        }
      }
    }
  } else {
    // Only check current bank in single bank mode
    const storedData = getStoredData(currentBank);
    const buttonValues = storedData.values || [];

    for (let i = 0; i < buttonValues.length && i < 10; i++) {
      const presetFreq = parseFloat(buttonValues[i]) || 0;

      // Check if frequencies match (with small tolerance for floating point comparison)
      if (Math.abs(currentFrequency - presetFreq) < 0.001) {
        const button = document.getElementById(`setFrequencyButton${i}`);
        if (button) {
          button.classList.add('preset-active');
        }
      }
    }
  }
}

// Function to monitor frequency
function startFrequencyMonitoring() {
  const monitorEveryFrequencyChange = true;
  // Disconnect any existing observer
  if (frequencyObserver) {
    frequencyObserver.disconnect();
  }

  const dataFrequencyElement = document.getElementById('data-frequency');
  if (!dataFrequencyElement) {
    setTimeout(startFrequencyMonitoring, 1000);
    return;
  }

  frequencyObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' || mutation.type === 'characterData') {
        setTimeout(() => {
          highlightActivePreset();
          if (monitorEveryFrequencyChange) updateKeyboardNavigationPosition();
        }, 0);
      }
    });
  });

  frequencyObserver.observe(dataFrequencyElement, {
    childList: true,
    subtree: true,
    characterData: true
  });

  highlightActivePreset();
}

// Function to update keyboard navigation position based on highlighted presets
function updateKeyboardNavigationPosition() {
  const highlightedButtons = document.querySelectorAll('#plugin-button-presets button.preset-active');

  if (highlightedButtons.length > 0) {
    // Use the first highlighted button if multiple exist
    const firstHighlighted = highlightedButtons[0];
    const buttonId = firstHighlighted.id;

    if (bankDisplayAll) {
      // In "Show All Presets" mode, extract bank and index from ID
      const match = buttonId.match(/setFrequencyButton([A-Z])(\d+)/);
      if (match) {
        currentPresetBank = match[1];
        currentPresetIndex = parseInt(match[2]);
      }
    } else {
      // In single bank mode, extract index from ID
      const match = buttonId.match(/setFrequencyButton(\d+)/);
      if (match) {
        currentPresetIndex = parseInt(match[1]);
        currentPresetBank = currentBank;
      }
    }
  }
}

// Global keyboard event listener for preset navigation
document.addEventListener('keydown', function(e) {
  const activeElement = document.activeElement;
  const isInputFocused = activeElement && (
    activeElement.tagName === 'INPUT' ||
    activeElement.tagName === 'TEXTAREA' ||
    activeElement.contentEditable === 'true'
  );

  if (!isInputFocused) {
    // Next preset
    if (e.key === ']') {
      if (!keysPressed.has(']')) {
        keysPressed.add(']');
        e.preventDefault();
        navigateToNextPreset();
      }
    }
    // Previous preset
    else if (e.key === '[') {
      if (!keysPressed.has('[')) {
        keysPressed.add('[');
        e.preventDefault();
        navigateToPreviousPreset();
      }
    }
  }
});

// Global keyboard event listener for key release
document.addEventListener('keyup', function(e) {
  // Clear key from pressed set when released
  if (e.key === ']' || e.key === '[') {
    keysPressed.delete(e.key);
  }
});

// Find the container to insert the button container after
const container = document.querySelector('.wrapper-outer #wrapper .flex-container') || document.querySelector('#wrapper-outer #wrapper .flex-container');

// Insert the button container after the container
if (document.getElementById('rt-container')) {
  container.parentNode.insertBefore(buttonContainer, container.nextSibling);
}

// Function to toggle the visibility of the button container
function toggleButtonContainer(statusToast) {
  // Check the localStorage value
  const isHidden = JSON.parse(localStorage.getItem(DISPLAY_KEY_ButtonPresets)) == true;
  if (isHidden) {
    if (typeof sendToast === 'function') {
      sendToast('info', t('toast.presetButtons'), t('toast.presetButtonsHidden'), false, false);
      console.log(`[${pluginName}] Button Preset plugin hidden`);
    }
    let element = document.getElementById('plugin-button-presets');
    element.style.setProperty('display', 'none');
    const buttonPresetsBankDropdown = document.getElementById('button-presets-bank-dropdown');
    if (buttonPresetsBankDropdown) buttonPresetsBankDropdown.style.display = 'none';
    let infoIconContainer = document.getElementById('button-presets-info-icon-container');
    
    if (infoIconContainer) {
      infoIconContainer.style.display = 'none';

      let styleButtonPresetsHide = document.createElement('style');
      styleButtonPresetsHide.innerHTML = `
        /* Preserve bottom margin (panels.css:93) */
        @media only screen and (min-width: 960px) and (max-height: 860px) {
            .wrapper-outer #wrapper .flex-container .panel-10.no-bg.m-0 .panel-10.no-bg.h-100 {
                height: 120px !important;
            }
        }
      `;
      // Append the style to the head of the document
      document.head.appendChild(styleButtonPresetsHide);
    }
    
  } else {
    if (typeof sendToast === 'function' && statusToast) {
      sendToast('info', t('toast.presetButtons'), t('toast.presetButtonsRestored'), false, false);
      console.log(`[${pluginName}] Button Preset plugin restored`);
    }
    let element = document.getElementById('plugin-button-presets');
    if (window.location.pathname !== '/setup') element.style.setProperty('display', 'flex');
    
    if (window.innerWidth >= 768) {
      let dropdown = document.getElementById('button-presets-bank-dropdown');
      if (dropdown) {
        dropdown.style.display = 'block';
      }
    }
    
    let infoIconContainer = document.getElementById('button-presets-info-icon-container');
    if (infoIconContainer) {
      infoIconContainer.style.display = 'flex';

      let styleButtonPresetsHide = document.createElement('style');
      styleButtonPresetsHide.innerHTML = `
        /* Preserve bottom margin (panels.css:93) */
        @media only screen and (min-width: 960px) and (max-height: 860px) {
            .wrapper-outer #wrapper .flex-container .panel-10.no-bg.m-0 .panel-10.no-bg.h-100 {
                height: 80px !important;
            }
        }
      `;
      // Append the style to the head of the document
      document.head.appendChild(styleButtonPresetsHide);
    }
    checkBankASum();
  }
}

// Initial tooltip
function initTooltipsOnce() {
  let tooltipText;
  $('.tooltip-presets-once').hover(function(e) {
    // Never display again after first click
    if (tooltipFirstLoad == true) { return; } else { tooltipFirstLoad = true; }
    $(document).on('mousedown', () => { clearTimeout($(this).data('timeout')); return; });
    if (!document.querySelector('.tooltip-presets-once')) { return; }
    if (!/Mobi|Android|iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent)) {
      tooltipText = t('plugin.buttonPresets.tooltipMobile');
    } else {
      tooltipText = t('plugin.buttonPresets.tooltipDesktop');
    }
    // Add a delay of 500 milliseconds before creating and appending the tooltip
    $(this).data('timeout', setTimeout(() => {
      let tooltip = $('<div class="tooltiptext"></div>').html(tooltipText);
      $('body').append(tooltip);
      
      let posX = e.pageX;
      let posY = e.pageY;
      
      let tooltipWidth = tooltip.outerWidth();
      let tooltipHeight = tooltip.outerHeight();
      posX -= tooltipWidth / 2;
      posY -= tooltipHeight + 10;
      tooltip.css({ top: posY, left: posX, opacity: .99 }); // Set opacity to 1
      // For touchscreen devices
      if ((/Mobi|Android|iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent)) && ('ontouchstart' in window || navigator.maxTouchPoints)) {
        setTimeout(() => { $('.tooltiptext').remove(); }, 10000);
        document.addEventListener('touchstart', function() { setTimeout(() => { $('.tooltiptext').remove(); }, 500); });
      }
    }, 500));
  }, function() {
    // Clear the timeout if the mouse leaves before the delay completes
    clearTimeout($(this).data('timeout'));
    $('.tooltiptext').remove();
  }).mousemove(function(e) {
    let tooltipWidth = $('.tooltiptext').outerWidth();
    let tooltipHeight = $('.tooltiptext').outerHeight();
    let posX = e.pageX - tooltipWidth / 2;
    let posY = e.pageY - tooltipHeight - 10;
    
    $('.tooltiptext').css({ top: posY, left: posX });
  });
}

// #################### SIDE BAR MENU SETTINGS #################### //

// ********** Display additional options in side menu **********
function AdditionalCheckboxesDisplayAll() { // ########## SHOW ALL PRESET BUTTONS ##########
    // Insert HTML after second element with class 'form-group checkbox'
    function insertHtmlAfterSecondCheckbox() {
        // Select all elements with class 'form-group checkbox'
        const checkboxes = document.querySelectorAll('.modal-panel-content .form-group');
        
        // Check if there are at least two such elements
        if (checkboxes.length > 0) {
            // Create new HTML element
            const newDiv = document.createElement('div');
            newDiv.className = 'form-group';
            newDiv.innerHTML = `
                <div class="switch flex-container flex-phone flex-phone-column flex-phone-center">
                    <input type="checkbox" tabindex="0" id="show-all-preset-buttons" aria-label="${t('plugin.buttonPresets.showAllPresetButtons')}">
                    <label for="show-all-preset-buttons" class="tooltip" data-tooltip="${t('plugin.buttonPresets.enableAllPresetBanks')}"></label>
                    <span class="text-smaller text-uppercase text-bold color-4 p-10">${t('plugin.buttonPresets.showAllPresets')}</span>
                </div>
            `;
            
            // Insert new element after last
            const lastCheckbox = checkboxes[checkboxes.length - 1];
            lastCheckbox.insertAdjacentElement('afterend', newDiv);
        } else {
            console.warn(`[${pluginName}] There are less than two elements with class "form-group checkbox".`);
        }
    }
    insertHtmlAfterSecondCheckbox();

    let isDisplayAll = localStorage.getItem("buttonPresetsDisplayAll");
    if (isDisplayAll === "true") {
        $("#show-all-preset-buttons").prop("checked", true);
    }

    $("#show-all-preset-buttons").change(function() {
        let isChecked = $(this).is(":checked");
        localStorage.setItem("buttonPresetsDisplayAll", isChecked);
        setDisplayAll();
    });

    function setDisplayAll() {
        if(localStorage.getItem('buttonPresetsDisplayAll') != 'true') {
          currentBank = 'A';
          bankDisplayAll = false;
          bankDisplayAllGap();
          toggleButtonContainer();
          updateButtons();
          console.log(`[${pluginName}] buttonPresetsDisplayAll = false`);
        } else {
          bankDisplayAll = true;
          bankDisplayAllGap();
          toggleButtonContainer();
          const buttonPresetsBankDropdown = document.getElementById('button-presets-bank-dropdown');
          if (buttonPresetsBankDropdown) buttonPresetsBankDropdown.style.display = 'none';
          updateButtons();
          console.log(`[${pluginName}] buttonPresetsDisplayAll = true`);
        }
        checkImageErrors();
        initTooltipsOnce();
    }

    // Create a MutationObserver instance
    const observerBackgroundImage = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const bodyElement = document.body;

                // Check if background style is set
                if (window.getComputedStyle(bodyElement).background !== 'none') {
                    // Stop observing once background is set
                    observerBackgroundImage.disconnect();
                    
                    // Run function
                    setDisplayAll();
                }
            }
        }
    });
    // Configuration of observer
    const config = {
        attributes: true,           // Observe attribute changes
        attributeFilter: ['style'], // Only observe changes to 'style' attribute
    };
    // Start observer
    observerBackgroundImage.observe(document.body, config);
}

// Display additional options in side menu and tooltips
if (!optionHideDisplayAll) {
  AdditionalCheckboxesDisplayAll();
}

// ********** Display additional options in side menu **********
function AdditionalCheckboxesButtonPresets() {
  // Insert HTML after second element with class 'form-group checkbox'
  function insertHtmlAfterSecondCheckbox() {
    // Select all elements with class 'form-group checkbox'
    const checkboxes = document.querySelectorAll('.modal-panel-content .form-group');
    
    // Check if there are at least two such elements
    if (checkboxes.length > 0) {
      // Create new HTML element
      const newDiv = document.createElement('div');
      newDiv.className = 'form-group';
      newDiv.innerHTML = `
                <div class="switch flex-container flex-phone flex-phone-column flex-phone-center">
                    <input type="checkbox" tabindex="0" id="hide-preset-buttons" aria-label="${t('plugin.buttonPresets.hidePresetButtons')}">
                    <label for="hide-preset-buttons"></label>
                    <span class="text-smaller text-uppercase text-bold color-4 p-10">${t('plugin.buttonPresets.hidePresets')}</span>
                </div>
            `;
      
      // Insert new element after last
      const lastCheckbox = checkboxes[checkboxes.length - 1];
      lastCheckbox.insertAdjacentElement('afterend', newDiv);
    } else {
      console.warn(`[${pluginName}] There are less than two elements with class "form-group checkbox".`);
    }
  }
  insertHtmlAfterSecondCheckbox();
  
  let isButtonPresetsHidden = localStorage.getItem(DISPLAY_KEY_ButtonPresets);
  if (isButtonPresetsHidden === "true") {
    $("#hide-preset-buttons").prop("checked", true);
  }
  
  $("#hide-preset-buttons").change(function() {
    let isChecked = $(this).is(":checked");
    localStorage.setItem(DISPLAY_KEY_ButtonPresets, isChecked);
    toggleButtonContainer(true);
  });
}

// Display additional options in side menu and tooltips
if (!optionHidePresetButtons) {
  AdditionalCheckboxesButtonPresets();
}

if (optionHideDisplayAll) initTooltipsOnce();

// Function to check if all preset values in bank A add up to 875
function checkBankASum() {
  // Fetch values for bank A
  const storedData = getStoredData('A');
  const buttonValues = storedData.values;
  
  // Calculate the sum of all preset values
  const sum = buttonValues.reduce((acc, value) => acc + value, 0);
  const sumDefault = defaultPresetData.values.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  
  // Check if the sum is equal to 875
  if (sum === 875 || sum === sumDefault) {
    showInfoIcon();
  } else {
    hideInfoIcon();
  }
}

// Native popup window
function popupMethod(selector, title, contentHtml) {
    const $popup = $(selector);
    const $header = $popup.find(".popup-header");
    const $title = $header.find("p.color-4");
    if ($title.length && !$title.hasClass("popup-title")) $title.addClass("popup-title");
    $popup.find(".popup-title").text(title);
    $popup.find(".popup-content").html(contentHtml);
    togglePopup(selector);
}

// Function to execute when the sum is 875
function executeInfoCode() {
  // Create a new div for the info icon
  let infoIconContainer = document.createElement('div');
  infoIconContainer.id = 'button-presets-info-icon-container'; // Assign an ID for later use
  infoIconContainer.style.position = 'absolute';
  infoIconContainer.style.bottom = '60px';
  infoIconContainer.style.right = '36px';
  infoIconContainer.style.display = 'flex';
  infoIconContainer.style.flexDirection = 'column';
  infoIconContainer.style.alignItems = 'center';
  infoIconContainer.style.imageRendering = 'auto';
  
  // Create the FontAwesome info icon
  let infoIcon = document.createElement('i');
  infoIcon.id = 'info-icon'; // Assign an ID to the icon itself
  infoIcon.classList.add('fa-solid', 'fa-circle-question');
  infoIcon.style.fontSize = '20px';
  infoIcon.style.cursor = 'pointer';
  
  // Add event listener to show alert when icon is clicked
  infoIcon.addEventListener('click', function() {
    let bankText = `<b>${bankName}</b> `;
    let bankQuantityText = '.';
    if (bankMenuLocation.includes('top')) bankText = '';
    if (bankQuantity > 3) bankQuantityText = ', etc...';
    const popupId = "#popup-panel-mobile-settings";
    const newTitle = t('plugin.buttonPresets.presetButtons');
    const newContent = `<p style=\"text-align: center;\"><i>Bu özellik, banka başına 10 ön ayar olmak üzere en fazla ${bankQuantity * 10} ön ayar depolamanıza olanak tanır.
    Bir frekansı depolamak için:</i>

    ${t('plugin.buttonPresets.alertExecuteIconInfo1')}
    ${t('plugin.buttonPresets.alertExecuteIconInfo2')}
    ${t('plugin.buttonPresets.alertExecuteIconInfo3')}
    ${t('plugin.buttonPresets.alertExecuteIconInfo4')}

    Banklar <i>A</i>, <i>B</i> veya <i>C</i>${bankQuantityText} arasından seçim yapmak için ${bankText} açılır menüsünü kullanın

    <strong>${t('plugin.buttonPresets.alertExecuteIconInfo5')}</strong>
    </p>`;
    const formattedContent = newContent.replace(/\n/g, '<br>');
    popupMethod(popupId, newTitle, formattedContent);
  });
  
  // Append the icon to the container and the container to the body
  infoIconContainer.appendChild(infoIcon);
  if (window.location.pathname !== '/setup') document.body.appendChild(infoIconContainer);
}

// Function to hide the info icon
function hideInfoIcon() {
  let infoIconContainer = document.getElementById('button-presets-info-icon-container');
  if (infoIconContainer) {
    infoIconContainer.style.display = 'none';
  }
}

// Function to show the info icon
function showInfoIcon() {
  let infoIconContainer = document.getElementById('button-presets-info-icon-container');
  if (infoIconContainer) {
    infoIconContainer.style.display = 'flex';
  }
}

// Initialize the info icon and check the bank A presets sum
if (infoIcon) {
  executeInfoCode();
}

checkBankASum();

// Call the toggle function on page load
toggleButtonContainer();

// Replace any missing logos with default logo
const containerButtonPresets = document.getElementById('plugin-button-presets');

function checkImageErrors() {
  if (containerButtonPresets) {
    containerButtonPresets.querySelectorAll('img').forEach(img => {
      img.onerror = () => {
        const imgSrc = img.src;
        const fileName = imgSrc.substring(imgSrc.lastIndexOf('/') + 1, imgSrc.lastIndexOf('.'));
        const fileExtension = imgSrc.substring(imgSrc.lastIndexOf('.'));

        // Check if .png
        if (fileExtension === '.png') {
          const webpSrc = imgSrc.replace('.png', '.webp');

          // Check if .webp
          const webpImage = new Image();
          webpImage.onload = () => {
            img.src = webpSrc; // Use .webp if it exists
          };
          webpImage.onerror = () => {
            // If .webp doesn't exist, check for .svg
            const svgSrc = imgSrc.replace('.png', '.svg');
            const svgImage = new Image();
            svgImage.onload = () => {
              img.src = svgSrc; // Use .svg if it exists
            };
            svgImage.onerror = () => {
              img.src = defaultButtonPresetImagePath; // If neither .webp nor .svg, fallback to default
            };
            svgImage.src = svgSrc;
          };
          webpImage.src = webpSrc;
        } else if (fileExtension === '.svg') {
          const svgImage = new Image();
          svgImage.onload = () => {
            img.src = imgSrc; // Use .svg if it exists
          };
          svgImage.onerror = () => {
            img.src = defaultButtonPresetImagePath; // If not .svg, fallback to default
          };
          svgImage.src = imgSrc;
        } else {
          // Default image
          img.src = defaultButtonPresetImagePath;
          img.style.filter = 'grayscale(100%)';
          img.style.maxWidth = '92px';
          img.style.maxHeight = '36px';
          img.style.opacity = '0.5';
        }
      };

      img.addEventListener('mousedown', (e) => {
        if (e.button === 0) {
          e.preventDefault(); // Prevent the default drag behavior
        }
      });
    });
  }
}

checkImageErrors();

// Export presets to file
function exportLocalStorageToFile() {
  const data = {};
  bankNames.forEach(bank => {
    const key = `buttonPresets${bank}`;
    const value = localStorage.getItem(key);
    if (value !== null) { // Check if bank exists in localStorage
      data[key] = value;
    }
  });

  const jsonData = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  // Fetch server name to include in filename
  const tunerNameEl = document.querySelector(
    ".wrapper-outer.dashboard-panel .panel-100-real #tuner-name.text-left"
  );

  let tunerName = Date.now();

  if (tunerNameEl) {
    tunerName = tunerNameEl.textContent.trim();
    tunerName = tunerName.replace(/\s+/g, "_");
    tunerName = tunerName.replace(/[^a-zA-Z0-9]/g, "_");
    tunerName = tunerName.replace(/_+/g, "_");
    tunerName = tunerName.replace(/^_+|_+$/g, "");
    tunerName = tunerName.slice(0, 32);
  }

  const a = document.createElement('a');
  a.href = url;
  a.download = 'FM-DX_Webserver_Presets_-_' + tunerName + '.json';
  a.style.display = 'none';  // Hide the link
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

// Import presets from file
function createFileInputAndImport() {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.json';
  fileInput.style.display = 'none';  // Hide the input

  document.body.appendChild(fileInput);

  fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
      importLocalStorageFromFile(file);
    }
  });

  fileInput.click();

  fileInput.remove();
}

function importLocalStorageFromFile(file) {
  const reader = new FileReader();

  reader.onload = function(event) {
    try {
      const data = JSON.parse(event.target.result);

      bankNames.forEach(bank => {
        const key = `buttonPresets${bank}`;
        if (data[key]) {
          localStorage.setItem(key, data[key]);
        }
      });

      updateButtons();

      setTimeout(() => {
        createImportExportButtons();
      }, 100);

      checkImageErrors();

      if (typeof sendToast === 'function') {
        sendToast('success', t('toast.presetButtonsImport'), t('toast.presetDataImportSuccess'), false, false);
      }
      console.log(`[${pluginName}] Button Preset localStorage updated successfully`);
    } catch (e) {
      if (typeof sendToast === 'function') {
        sendToast('error', t('toast.presetButtonsImport'), t('toast.presetDataImportError'), false, false);
      }
      console.error('Unable to import localStorage preset data', e);
    }
  };

  reader.onerror = function(event) {
    console.error('Error reading file:', event);
  };

  reader.readAsText(file);
}

// Create and append import/export buttons
function createImportExportButtons() {
  // Create the export button
  const exportButton = document.createElement('button');
  exportButton.id = 'export-button-preset';
  exportButton.classList.add('tooltip-presets');
  exportButton.setAttribute('data-tooltip', t('plugin.buttonPresets.exportToFile'));
  exportButton.style.fontSize = '14px';
  exportButton.style.backgroundColor = '#990903';
  exportButton.style.border = 'none';
  exportButton.style.borderRadius = '50%';
  exportButton.style.width = '12px';
  exportButton.style.height = '12px';
  exportButton.style.cursor = 'pointer';
  exportButton.style.position = 'absolute';
  exportButton.style.transform = 'scale(0.8)';
  exportButton.style.right = window.innerHeight > 720 ? '-10px' : '-10px'; // Previousy -10px, -2px
  exportButton.style.bottom = '26px';
  if (!/Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    exportButton.style.marginRight = '0';
  }

  // Create the import button
  const importButton = document.createElement('button');
  importButton.id = 'import-button-preset';
  importButton.classList.add('tooltip-presets');
  importButton.setAttribute('data-tooltip', t('plugin.buttonPresets.importFromFile'));
  importButton.style.fontSize = '14px';
  importButton.style.backgroundColor = '#036009';
  importButton.style.border = 'none';
  importButton.style.borderRadius = '50%';
  importButton.style.width = '12px';
  importButton.style.height = '12px';
  importButton.style.cursor = 'pointer';
  importButton.style.position = 'absolute';
  importButton.style.transform = 'scale(0.8)';
  importButton.style.right = window.innerHeight > 720 ? '-10px' : '-10px'; // Previousy -10px, -2px
  importButton.style.bottom = '10px';
  if (!/Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    importButton.style.marginRight = '0';
  }

  // Add click event listeners
  importButton.addEventListener('click', createFileInputAndImport);
  exportButton.addEventListener('click', exportLocalStorageToFile);

  // Add the buttons to the #plugin-button-presets element
  const pluginButtonPresets = document.querySelector('#plugin-button-presets');
  if (pluginButtonPresets !== null) {
    pluginButtonPresets.appendChild(importButton);
    pluginButtonPresets.appendChild(exportButton);


    // Add hover effect for the #plugin-button-presets
    pluginButtonPresets.addEventListener('mouseover', () => {
      importButton.style.display = 'inline-block';
      exportButton.style.display = 'inline-block';
    });

    if (!/Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      pluginButtonPresets.addEventListener('mouseout', () => {
        importButton.style.display = 'none';
        exportButton.style.display = 'none';
      });

      // Initially hide the buttons
      importButton.style.display = 'none';
      exportButton.style.display = 'none';
    }
  }
}

// Call function to create and append import/export buttons
createImportExportButtons();

// Code if a custom font is used
document.addEventListener("DOMContentLoaded", function () {
    if (allowCustomFont == 'true') {
        setTimeout(() => {
            updateButtons();
        }, 100);
        setTimeout(() => {
            updateButtons();
        }, 1000);
    } else if (allowCustomFont == 'false') {
        const defaultFont = `'Roboto Mono', monospace`;
        $(document).on('mousedown mouseup', function() {
            setTimeout(() => {
                $('#plugin-button-presets .button-text').css({
                    'font-family': defaultFont
                });
            }, 10);
        });
    } else {
        // Default
    }
});

// Function for update notification in /setup
function checkUpdate(setupOnly, pluginVersion, pluginName, urlUpdateLink, urlFetchLink) {
    if (setupOnly && window.location.pathname !== '/setup') return;

    // Function to check for updates
    async function fetchFirstLine() {
        const urlCheckForUpdate = urlFetchLink;

        try {
            const response = await fetch(urlCheckForUpdate);
            if (!response.ok) {
                throw new Error(`[${pluginName}] update check HTTP error! status: ${response.status}`);
            }

            const text = await response.text();
            const lines = text.split('\n');

            let version;

            if (lines.length > 2) {
                const versionLine = lines.find(line => line.includes("const pluginVersion =") || line.includes("const plugin_version ="));
                if (versionLine) {
                    const match = versionLine.match(/const\s+plugin[_vV]ersion\s*=\s*['"]([^'"]+)['"]/);
                    if (match) {
                        version = match[1];
                    }
                }
            }

            if (!version) {
                const firstLine = lines[0].trim();
                version = /^\d/.test(firstLine) ? firstLine : "Unknown"; // Check if first character is a number
            }

            return version;
        } catch (error) {
            console.error(`[${pluginName}] error fetching file:`, error);
            return null;
        }
    }

    // Check for updates
    fetchFirstLine().then(newVersion => {
        if (newVersion) {
            if (newVersion !== pluginVersion) {
                let updateConsoleText = t('plugin.newVersionAvailable');
                // Any custom code here
                
                console.log(`[${pluginName}] ${updateConsoleText}`);
                setupNotify(pluginVersion, newVersion, pluginName, urlUpdateLink);
            }
        }
    });

    function setupNotify(pluginVersion, newVersion, pluginName, urlUpdateLink) {
        if (window.location.pathname === '/setup') {
          const pluginSettings = document.getElementById('plugin-settings');
          if (pluginSettings) {
            const currentText = pluginSettings.textContent.trim();
            const newText = `<a href="${urlUpdateLink}" target="_blank">[${pluginName}] ${t('plugin.updateAvailable')}: ${pluginVersion} --> ${newVersion}</a><br>`;

            if (currentText === t('plugin.noPluginSettings')) {
              pluginSettings.innerHTML = newText;
            } else {
              pluginSettings.innerHTML += ' ' + newText;
            }
          }

          const updateIcon = document.querySelector('.wrapper-outer #navigation .sidenav-content .fa-puzzle-piece') || document.querySelector('.wrapper-outer .sidenav-content') || document.querySelector('.sidenav-content');

          const redDot = document.createElement('span');
          redDot.style.display = 'block';
          redDot.style.width = '12px';
          redDot.style.height = '12px';
          redDot.style.borderRadius = '50%';
          redDot.style.backgroundColor = '#FE0830' || 'var(--color-main-bright)'; // Theme colour set here as placeholder only
          redDot.style.marginLeft = '82px';
          redDot.style.marginTop = '-12px';

          updateIcon.appendChild(redDot);
        }
    }
}

if (CHECK_FOR_UPDATES) checkUpdate(pluginSetupOnlyNotify, pluginVersion, pluginName, pluginHomepageUrl, pluginUpdateUrl);

})();
