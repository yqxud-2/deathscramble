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

// initialize
let container, slider, multiplierDisplay, viewport, flash, inputField;

// give values after html loads
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

// loop for each letter
function letterChaosLoop(el) {
    if(!el.isConnected) return; // probably dont need this anymore but i added it because it wasnt working at one point

    // fonts :>
    const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
    el.style.fontFamily = randomFont;

    el.style.fontSize = "50px";  
    el.style.opacity = "1";          
    el.style.color = "orange";  
    el.style.display = "inline-block";

    // sizing :o
    /*const randomSize = (Math.random() * 5 + 2).toFixed(2);
    el.style.fontSize = `${randomSize}rem`;

    // uppercase, lowercase
    const currentChar = el.innerText;
    el.innerText = Math.random() > 0.5 ? currentChar.toUpperCase() : currentChar.toLowerCase();

    // thiccc or thinnn
    el.style.fontWeight = Math.random() * 1000;

    // text deco
    const decos = [];
    if (Math.random() > 0.7) decos.push('underline');
    if (Math.random() > 0.7) decos.push('line-through');
    el.style.textDecoration = decos.length > 0 ? decos.join(' ') : 'none';

    el.style.textDecorationThickness = `${Math.random()*10+2}px`;
    // idk but the code wouldn't work without this
    el.style.textDecorationColor = '#ffffff';

    // i like to move it move it
    el.style.transform = `
        rotate(${Math.random() * 360}deg) 
        scaleX(${(Math.random() > 0.5 ? -1 : 1)*Math.random()*2+0.5}) 
        translateY(${Math.random() * 60-30}px)`;

    if (Math.random() > 0.9) {
        el.style.opacity = "0";
    } else {
        const opacityLevels = [0.2, 0.5, 1.0]; 
        el.style.opacity = opacityLevels[Math.floor(Math.random() * opacityLevels.length)];
    }
    */
    
    const delay = (Math.random() * 500 + 100) / difficultyMultiplier;
    setTimeout(() => letterChaosLoop(el), delay);
}


// scramble and teleport
function rescrambleIntervalLoop() {
    /*
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
    */
}

// background chaos :)))
function backgroundChaosLoop() {
    /*
    viewport.classList.toggle('pattern-a');
    viewport.classList.toggle('pattern-b');
    const delay = (Math.random() * 1000 + 500) / difficultyMultiplier;
    setTimeout(backgroundChaosLoop, delay);
    */
}

// epilepsy :P
function afterimageFlashLoop() {
    /*
    flash.style.opacity = 1;
    setTimeout(() => flash.style.opacity = 0, 16); 
    const delay = (Math.random() * 3000 + 3000) / difficultyMultiplier;
    setTimeout(afterimageFlashLoop, delay);
    */
}

// breathe in, breathe out
function breathingKerningLoop() {
    /*
    const tracking = Math.random() * 40 - 20; 
    container.style.letterSpacing = `${tracking}px`;
    setTimeout(breathingKerningLoop, 2000 / difficultyMultiplier);
    */
}
