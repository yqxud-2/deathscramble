const fonts = [ 
    'BungeeShade', 
    'Codystar', 
    'ComicRelief', 
    'Creepster', 
    'DotGothic16', 
    'Monoton', 
    'Nosifer', 
    'RubikGlitchPop', 
    'ZillaSlabHighlight' 
]; 

let wordList = [];  
let currentWord = ""; 
let scrambledArray = []; 
let difficultyMultiplier = 1.0; 

// settings
let allowTeleport = true;
let allowFontChaos = true;
let allowJumping = true;
let allowAngles = true;
let allowSizing = true;
let allowBg = true;
let isMenuOpen = false;
let tapTimes = [];

// initialize 
let container, slider, multiplierDisplay, viewport, flash, inputField; 
let adminMenu, closeAdminBtn 
let jumpingToggle, anglesToggle, sizingToggle, teleportToggle, fontToggle, bgToggle,

// give values after html loads 
document.addEventListener('DOMContentLoaded', () => { 
    container = document.getElementById('scrambled-container'); 
    slider = document.getElementById('speed-slider'); 
    multiplierDisplay = document.getElementById('multiplier-display'); 
    viewport = document.getElementById('game-viewport'); 
    flash = document.getElementById('flash-overlay'); 
    inputField = document.getElementById('user-input'); 

    // Admin settings!!!
    adminMenu = document.getElementById('admin-menu');
    
    teleportToggle = document.getElementById('toggle-teleport');
    fontToggle = document.getElementById('toggle-fonts');
    jumpingToggle = document.getElementById('toggle-jumping');
    anglesToggle = document.getElementById('toggle-angles');
    sizingToggle = document.getElementById('toggle-sizing');
    bgToggle = document.getElementById('toggle-bg');
    
    closeAdminBtn = document.getElementById('close-admin');

    setupInputListener(); 
    initGame(); 
}); 

// starting the game!!! 
async function initGame() { 
    try { 
        const response = await fetch('words.json'); 
        if (response.ok) { 
            const data = await response.json(); 
            wordList = data.word_list; 
        } 
    } catch (error) { 
        alert("oh no, i couldn't load the words :(((( try refreshing"); 
    } 
    
    setupNewWord(); 
    
    // begin the chaos 
    backgroundChaosLoop(); 
    afterimageFlashLoop(); 
    rescrambleIntervalLoop(); 
    breathingKerningLoop(); 
} 

// get a bew word 
function setupNewWord() { 
    currentWord = wordList[Math.floor(Math.random() * wordList.length)]; 
    scrambledArray = currentWord.split('').sort(() => Math.random() - 0.5); 
    
    // center it to be fair 
    container.style.top = "40%"; 
    container.style.left = "50%"; 
    
    renderLetters(); 
} 

function renderLetters() { 
    container.innerHTML = '';  
    scrambledArray.forEach((char, index) => { 
        const span = document.createElement('span'); 
        span.className = 'chaos-letter'; 
        span.innerText = char; 
        span.id = `letter-${index}`; 
        container.appendChild(span); 
        
        // continue chaos 
        letterChaosLoop(span); 
    }); 
} 

// adjust difficulty for the weak minded or strong willed 
function setupInputListener() { 
    // tap 4 times to open admin
    document.addEventListener('click', (e) => {
        
        if (e.target.closest('#admin-menu')) return;

        const now = Date.now();
        tapTimes.push(now);

        if (tapTimes.length > 4) tapTimes.shift();

        if (tapTimes.length === 4 && (tapTimes[3] - tapTimes[0] < 1000)) {
            openAdminMenu();
            tapTimes = [];
        }
    });

    // become admin >:D
    closeAdminBtn.addEventListener('click', closeAdminMenu);

    teleportToggle.addEventListener('change', (e) => {
        allowTeleport = e.target.checked;
    });

    fontToggle.addEventListener('change', (e) => {
        allowFontChaos = e.target.checked;
    });

    jumpingToggle.addEventListener('change', (e) => {
        allowJumping = e.target.checked;
    });

    anglesToggle.addEventListener('change', (e) => {
        allowAngles = e.target.checked;
    });

    sizingToggle.addEventListener('change', (e) => {
        allowSizing = e.target.checked;
    });

    bgToggle.addEventListener('change', (e) => {
        allowBg = e.target.checked;
        document.getElementById('normalBg').style.display = allowBg ? 'none' : 'block';
    });

    slider.addEventListener('input', (e) => { 
        difficultyMultiplier = parseFloat(e.target.value); 
        multiplierDisplay.innerText = difficultyMultiplier.toFixed(1) + "x"; 
        
        const bgSpeed = 0.15 / difficultyMultiplier; 
        document.documentElement.style.setProperty('--bg-speed', `${bgSpeed}s`); 
        
        const blurAmt = difficultyMultiplier > 2.5 ? (difficultyMultiplier - 2.5) * 2 : 0; 
        document.documentElement.style.setProperty('--blur-amount', `${blurAmt}px`); 
    }); 

    inputField.addEventListener('keypress', function(e) { 
        if (e.key === 'Enter') { 
            if (this.value.toUpperCase() === currentWord.toUpperCase()) { 
                viewport.style.backgroundColor = "green";  
                setTimeout(() => viewport.style.backgroundColor = "", 200); 
                this.value = ""; 
                setupNewWord(); 
            } else { 
                viewport.style.backgroundColor = "red"; 
                setTimeout(() => viewport.style.backgroundColor = "", 100); 
                
                scrambledArray.sort(() => Math.random() - 0.5); 
                scrambledArray.forEach((char, i) => { 
                    const el = document.getElementById(`letter-${i}`); 
                    if(el) el.innerText = char; 
                }); 
                
                if (allowTeleport) {
                    container.style.top = `${Math.floor(Math.random() * 50) + 10}%`; 
                    container.style.left = `${Math.floor(Math.random() * 60) + 20}%`; 
                }
                
                this.value = ""; 
            } 
        } 
    }); 
} 

function openAdminMenu() {
    isMenuOpen = true;
    adminMenu.style.display = 'flex';
    viewport.classList.add('paused-chaos');
}

function closeAdminMenu() {
    isMenuOpen = false;
    adminMenu.style.display = 'none';
    viewport.classList.remove('paused-chaos');
    renderLetters();
    inputField.focus(); 
}

// loop for each letter 
function letterChaosLoop(el) { 
    if(!el || !el.isConnected) return; // probably dont need this anymore but i added it because it wasnt working at one point 

    // fonts :> 
    if (allowFontChaos && fonts && fonts.length > 0) {
        const randomFont = fonts[Math.floor(Math.random() * fonts.length)]; 
        el.style.fontFamily = randomFont; 
    } else {
        el.style.fontFamily = 'sans-serif'; // readable font
    }

    // sizing :o 
    const randomSize = allowSizing ? (Math.random() * 5 + 2).toFixed(2) : 4.5; 
    el.style.fontSize = `${randomSize}rem`; 

    // uppercase, lowercase 
    const char = el.innerText; 
    if (char) {
        el.innerText = Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase(); 
    }
    
    // thiccc or thinnn 
    const possibleWeights = [300, 400, 700, 900]; 
    el.style.fontWeight = possibleWeights[Math.floor(Math.random() * possibleWeights.length)]; 

    // text deco 
    const decos = []; 
    if (Math.random() > 0.7) decos.push('underline'); 
    if (Math.random() > 0.7) decos.push('line-through'); 
    el.style.textDecoration = decos.length > 0 ? decos.join(' ') : 'none'; 

    el.style.textDecorationThickness = `${Math.random()*10+2}px`; 
    // idk but the code wouldn't work without this 
    el.style.textDecorationColor = '#ffffff'; 

    // i like to move it move it 
    const rot = allowAngles ? Math.random() * 360 : 0;
    const scale = allowSizing ? (Math.random() > 0.5 ? -1 : 1) * Math.random() * 2 + 0.5 : 1;
    const transY = allowJumping ? Math.random() * 60 - 30 : 0;
    el.style.transform = `rotate(${rot}deg) scaleX(${scale}) translateY(${transY}px)`; 

    if (Math.random() > 0.9) { 
        el.style.opacity = "0"; 
    } else { 
        const opacityLevels = [0.2, 0.5, 1.0];  
        el.style.opacity = opacityLevels[Math.floor(Math.random() * opacityLevels.length)]; 
    } 
    
    const mult = difficultyMultiplier || 1.0;
    const delay = (Math.random() * 500 + 100) / mult; 
    setTimeout(() => letterChaosLoop(el), delay); 
} 

// scramble and teleport 
function rescrambleIntervalLoop() { 
    
    scrambledArray.sort(() => Math.random() - 0.5); 
    scrambledArray.forEach((char, i) => { 
        const el = document.getElementById(`letter-${i}`); 
        if(el) el.innerText = char; 
    }); 

    if (allowTeleport) {
        const randomTop = Math.floor(Math.random() * 50) + 10;  
        const randomLeft = Math.floor(Math.random() * 60) + 20; 
        
        container.style.top = `${randomTop}%`; 
        container.style.left = `${randomLeft}%`; 
    }

    const delay = (Math.random() * 2000 + 500) / difficultyMultiplier; 
    setTimeout(rescrambleIntervalLoop, delay); 
    
} 

// background chaos :))) 
function backgroundChaosLoop() { 
    if (allowBg) {
        viewport.classList.toggle('pattern-a'); 
        viewport.classList.toggle('pattern-b'); 
        const delay = (Math.random() * 1000 + 500) / difficultyMultiplier; 
        setTimeout(backgroundChaosLoop, delay); 
    }    
} 

// epilepsy :P 
function afterimageFlashLoop() { 
    
    flash.style.opacity = 1; 
    setTimeout(() => flash.style.opacity = 0, 16);  
    const delay = (Math.random() * 3000 + 3000) / difficultyMultiplier; 
    setTimeout(afterimageFlashLoop, delay); 
    
} 

// breathe in, breathe out 
function breathingKerningLoop() { 
    
    const tracking = Math.random() * 40 - 20;  
    container.style.letterSpacing = `${tracking}px`; 
    setTimeout(breathingKerningLoop, 2000 / difficultyMultiplier); 
    
}
