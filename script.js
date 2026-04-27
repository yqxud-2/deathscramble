// Expanded font list
const fonts = [
    '"Impact", fantasy', 
    '"Courier New", monospace', 
    '"Comic Sans MS", "Marker Felt", cursive', 
    '"Papyrus", fantasy', 
    '"Times New Roman", serif', 
    '"Arial Black", sans-serif',
    'system-ui'
];

let wordList = []; 
let currentWord = "";
let scrambledArray = [];
let difficultyMultiplier = 1.0;

// Variables for DOM elements (Queried after load to prevent crashes)
let container, slider, multiplierDisplay, viewport, flash, inputField;

// 1. Wait for HTML to load before grabbing elements
document.addEventListener('DOMContentLoaded', () => {
    container = document.getElementById('scrambled-container');
    slider = document.getElementById('speed-slider');
    multiplierDisplay = document.getElementById('multiplier-display');
    viewport = document.getElementById('game-viewport');
    flash = document.getElementById('flash-overlay');
    inputField = document.getElementById('user-input');

    setupInputListener();
    initGame();
});

// 2. Initialization
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
    
    // Start the Global Loops
    backgroundChaosLoop();
    afterimageFlashLoop();
    rescrambleIntervalLoop();
    breathingKerningLoop();
}

// 3. Game Setup
function setupNewWord() {
    currentWord = wordList[Math.floor(Math.random() * wordList.length)];
    scrambledArray = currentWord.split('').sort(() => Math.random() - 0.5);
    
    // Reset position to center
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
        
        // Ignite independent loop
        letterChaosLoop(span);
    });
}

// 4. The Slider Logic
function setupInputListener() {
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
                
                container.style.top = `${Math.floor(Math.random() * 50) + 10}%`;
                container.style.left = `${Math.floor(Math.random() * 60) + 20}%`;
                
                this.value = "";
            }
        }
    });
}

// 5. The Chaos Loops

// LOOP A: Independent Letter Chaos
function letterChaosLoop(el) {
    if(!el.isConnected) return; // Bulletproof check to see if element exists

    // Font
    const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
    el.style.fontFamily = `"${randomFont}"`;

    // Size
    const randomSize = (Math.random() * 5 + 2).toFixed(2);
    el.style.fontSize = `${randomSize}rem`;

    // Case (The SpongeBob Effect)
    const currentChar = el.innerText;
    el.innerText = Math.random() > 0.5 ? currentChar.toUpperCase() : currentChar.toLowerCase();

    // Weight
    el.style.fontWeight = Math.random() * 1000;

    // Decorations (Underline/Strikethrough)
    const decos = [];
    if (Math.random() > 0.7) decos.push('underline');
    if (Math.random() > 0.7) decos.push('line-through');
    el.style.textDecoration = decos.length > 0 ? decos.join(' ') : 'none';

    el.style.textDecorationThickness = `${Math.random()*10+2}px`;
    // Force the decoration color to white so it contrasts with the background
    el.style.textDecorationColor = '#ffffff';

    // Transformations
    el.style.transform = `
        rotate(${Math.random() * 180 - 90}deg) 
        scaleX(${Math.random() > 0.5 ? -1 : 1}*${Math.random()*2+0.5}) 
        translateY(${Math.random() * 40 - 20}px)`;

    if (Math.random() > 0.9) {
        el.style.opacity = "0";
    } else {
        const opacityLevels = [0.2, 0.5, 1.0]; 
        el.style.opacity = opacityLevels[Math.floor(Math.random() * opacityLevels.length)];
    }
    
    const delay = (Math.random() * 500 + 100) / difficultyMultiplier;
    setTimeout(() => letterChaosLoop(el), delay);
}

// LOOP B: Word Rescramble & Teleport
function rescrambleIntervalLoop() {
    scrambledArray.sort(() => Math.random() - 0.5);
    scrambledArray.forEach((char, i) => {
        const el = document.getElementById(`letter-${i}`);
        if(el) el.innerText = char;
    });

    const randomTop = Math.floor(Math.random() * 50) + 10; 
    const randomLeft = Math.floor(Math.random() * 60) + 20;
    
    container.style.top = `${randomTop}%`;
    container.style.left = `${randomLeft}%`;

    const delay = (Math.random() * 2000 + 500) / difficultyMultiplier;
    setTimeout(rescrambleIntervalLoop, delay);
}

// LOOP C: Pattern Swap
function backgroundChaosLoop() {
    viewport.classList.toggle('pattern-a');
    viewport.classList.toggle('pattern-b');
    const delay = (Math.random() * 2000 + 500) / difficultyMultiplier;
    setTimeout(backgroundChaosLoop, delay);
}

// LOOP D: Flash
function afterimageFlashLoop() {
    flash.style.opacity = 1;
    setTimeout(() => flash.style.opacity = 0, 16); 
    const delay = (Math.random() * 3000 + 3000) / difficultyMultiplier;
    setTimeout(afterimageFlashLoop, delay);
}

// LOOP E: Kerning
function breathingKerningLoop() {
    const tracking = Math.random() * 40 - 20; 
    container.style.letterSpacing = `${tracking}px`;
    setTimeout(breathingKerningLoop, 2000 / difficultyMultiplier);
}
