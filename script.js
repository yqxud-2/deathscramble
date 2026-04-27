// Expanded font list for high visual chaos
const fonts = [
    'Impact', 'Courier New', 'Comic Sans MS', 'Papyrus', 'Algerian', 
    'Marker Felt', 'Chalkduster', 'Times New Roman', 'Georgia', 'Arial Black'
];

// Fallback list just in case GitHub Pages takes a second to serve the JSON
let wordList = ["NIGHTMARE", "DYSLEXIA", "TORTURE", "CHAOS"]; 
let currentWord = "";
let scrambledArray = [];
let difficultyMultiplier = 1.0;

// DOM Elements
const container = document.getElementById('scrambled-container');
const slider = document.getElementById('speed-slider');
const multiplierDisplay = document.getElementById('multiplier-display');
const viewport = document.getElementById('game-viewport');
const flash = document.getElementById('flash-overlay');
const inputField = document.getElementById('user-input');

// 1. Initialization
async function initGame() {
    try {
        const response = await fetch('words.json');
        if (response.ok) {
            const data = await response.json();
            wordList = data.word_list;
        }
    } catch (error) {
        console.warn("JSON failed to load, using fallback word list.");
    }
    
    setupNewWord();
    
    // Start the Global Loops
    backgroundChaosLoop();
    afterimageFlashLoop();
    rescrambleIntervalLoop();
    breathingKerningLoop();
}

// 2. Game Setup
function setupNewWord() {
    currentWord = wordList[Math.floor(Math.random() * wordList.length)];
    scrambledArray = currentWord.split('').sort(() => Math.random() - 0.5);
    
    // Reset position to center for the new word
    container.style.top = "40%";
    container.style.left = "50%";
    
    renderLetters();
}

function renderLetters() {
    container.innerHTML = ''; // Clear old letters
    scrambledArray.forEach((char, index) => {
        const span = document.createElement('span');
        span.className = 'chaos-letter';
        span.innerText = char;
        span.id = `letter-${index}`;
        container.appendChild(span);
        
        // Start independent loop for this specific letter
        letterChaosLoop(span);
    });
}

// 3. The Slider Logic
slider.addEventListener('input', (e) => {
    difficultyMultiplier = parseFloat(e.target.value);
    multiplierDisplay.innerText = difficultyMultiplier.toFixed(1) + "x";
    
    // Update CSS variables for background speed
    const bgSpeed = 0.15 / difficultyMultiplier;
    document.documentElement.style.setProperty('--bg-speed', `${bgSpeed}s`);
    
    // Add motion blur at higher multipliers
    const blurAmt = difficultyMultiplier > 2.5 ? (difficultyMultiplier - 2.5) * 2 : 0;
    document.documentElement.style.setProperty('--blur-amount', `${blurAmt}px`);
});

// 4. The Chaos Loops

// LOOP A: Independent Letter Chaos
function letterChaosLoop(el) {
    if(!document.contains(el)) return; // Kills the loop if the letter was removed from DOM

    // 1. Random Font
    const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
    el.style.fontFamily = `"${randomFont}", sans-serif`;

    // 2. Random Size (2rem to 7rem)
    const randomSize = (Math.random() * 5 + 2).toFixed(2);
    el.style.fontSize = `${randomSize}rem`;

    // 3. Random Case (The SpongeBob Effect)
    const currentChar = el.innerText;
    el.innerText = Math.random() > 0.5 ? currentChar.toUpperCase() : currentChar.toLowerCase();

    // 4. Random Weight
    el.style.fontWeight = Math.random() > 0.5 ? '900' : '100';

    // 5. Random Decorations (Underline/Strikethrough)
    const decos = [];
    if (Math.random() > 0.7) decos.push('underline');
    if (Math.random() > 0.7) decos.push('line-through');
    el.style.textDecoration = decos.length > 0 ? decos.join(' ') : 'none';

    // 6. Transformations (Skew, Flip, Jitter)
    el.style.transform = `
        rotate(${Math.random() * 40 - 20}deg) 
        scaleX(${Math.random() > 0.8 ? -1 : 1}) 
        translateY(${Math.random() * 20 - 10}px)`;

    // 7. Winking (Opacity dropout)
    el.style.opacity = Math.random() > 0.9 ? 0 : 1; 
    
    // Delay based on multiplier
    const delay = (Math.random() * 500 + 100) / difficultyMultiplier;
    setTimeout(() => letterChaosLoop(el), delay);
}

// LOOP B: Word Rescramble & Spatial Teleportation
function rescrambleIntervalLoop() {
    // 1. Shuffle the array
    scrambledArray.sort(() => Math.random() - 0.5);
    
    // 2. Apply to the DOM elements
    scrambledArray.forEach((char, i) => {
        const el = document.getElementById(`letter-${i}`);
        if(el) el.innerText = char;
    });

    // 3. Teleport the container
    // Keep it between 20% and 80% width, and 10% and 60% height to avoid UI
    const randomTop = Math.floor(Math.random() * 50) + 10; 
    const randomLeft = Math.floor(Math.random() * 60) + 20;
    
    container.style.top = `${randomTop}%`;
    container.style.left = `${randomLeft}%`;

    // Base 2-8 seconds
    const delay = (Math.random() * 6000 + 2000) / difficultyMultiplier;
    setTimeout(rescrambleIntervalLoop, delay);
}

// LOOP C: Background Pattern Swap
function backgroundChaosLoop() {
    viewport.classList.toggle('pattern-a');
    viewport.classList.toggle('pattern-b');
    
    // Base 0.5-2.5 seconds
    const delay = (Math.random() * 2000 + 500) / difficultyMultiplier;
    setTimeout(backgroundChaosLoop, delay);
}

// LOOP D: Retinal Flash (Afterimage)
function afterimageFlashLoop() {
    flash.style.opacity = 1;
    setTimeout(() => flash.style.opacity = 0, 16); // 1 frame flash
    
    // Base 3-6 seconds
    const delay = (Math.random() * 3000 + 3000) / difficultyMultiplier;
    setTimeout(afterimageFlashLoop, delay);
}

// LOOP E: Breathing Kerning
function breathingKerningLoop() {
    // Randomly stretches and squishes the word horizontally (-20px to 20px)
    const tracking = Math.random() * 40 - 20; 
    container.style.letterSpacing = `${tracking}px`;
    
    setTimeout(breathingKerningLoop, 2000 / difficultyMultiplier);
}

// 5. Input Validation & Punishment
inputField.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        if (this.value.toUpperCase() === currentWord.toUpperCase()) {
            // Correct Answer
            viewport.style.backgroundColor = "green"; // Brief flash of victory
            setTimeout(() => viewport.style.backgroundColor = "", 200);
            this.value = "";
            setupNewWord();
        } else {
            // Wrong Answer Punishment
            viewport.style.backgroundColor = "red";
            setTimeout(() => viewport.style.backgroundColor = "", 100);
            
            // Instant Rescramble and Teleport
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

// Ignite the engine
initGame();
