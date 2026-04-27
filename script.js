const fonts = ['Impact', 'Courier New', 'Comic Sans MS', 'Georgia', 'Arial Black', 'Times New Roman'];
let wordList = [];
let currentWord = "";
let scrambledArray = [];
let difficultyMultiplier = 1.0;


const container = document.getElementById('scrambled-container');
const slider = document.getElementById('speed-slider');
const multiplierDisplay = document.getElementById('multiplier-display');
const viewport = document.getElementById('game-viewport');
const flash = document.getElementById('flash-overlay');


async function initGame() {
    try {
        const response = await fetch('words.json');
        const data = await response.json();
        wordList = data.word_list;
        
        setupNewWord();
        

        backgroundChaosLoop();
        afterimageFlashLoop();
        rescrambleIntervalLoop();
        breathingKerningLoop();
        
    } catch (error) {
        console.error("Failed to load words.json. Are you running this on a server/GitHub Pages?", error);
        container.innerText = "ERROR LOADING JSON";
    }
}


function setupNewWord() {
    currentWord = wordList[Math.floor(Math.random() * wordList.length)];
    scrambledArray = currentWord.split('').sort(() => Math.random() - 0.5);
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
        

        letterChaosLoop(span);
    });
}


slider.addEventListener('input', (e) => {
    difficultyMultiplier = parseFloat(e.target.value);
    multiplierDisplay.innerText = difficultyMultiplier.toFixed(1) + "x";
    

    const bgSpeed = 0.15 / difficultyMultiplier;
    document.documentElement.style.setProperty('--bg-speed', `${bgSpeed}s`);
    

    const blurAmt = difficultyMultiplier > 2.0 ? (difficultyMultiplier - 2) : 0;
    document.documentElement.style.setProperty('--blur-amount', `${blurAmt}px`);
});


function letterChaosLoop(el) {
    if(!document.contains(el)) return; 

    el.style.fontFamily = fonts[Math.floor(Math.random() * fonts.length)];

    el.style.transform = `
        rotate(${Math.random() * 40 - 20}deg) 
        scaleX(${Math.random() > 0.8 ? -1 : 1}) 
        translateY(${Math.random() * 20 - 10}px)`;

    el.style.opacity = Math.random() > 0.85 ? 0 : 1; 
    

    const delay = (Math.random() * 500 + 100) / difficultyMultiplier;
    setTimeout(() => letterChaosLoop(el), delay);
}


function rescrambleIntervalLoop() {
    scrambledArray.sort(() => Math.random() - 0.5);
    scrambledArray.forEach((char, i) => {
        const el = document.getElementById(`letter-${i}`);
        if(el) el.innerText = char;
    });


    const delay = (Math.random() * 6000 + 2000) / difficultyMultiplier;
    setTimeout(rescrambleIntervalLoop, delay);
}


function backgroundChaosLoop() {
    viewport.classList.toggle('pattern-a');
    viewport.classList.toggle('pattern-b');
    

    const delay = (Math.random() * 2000 + 500) / difficultyMultiplier;
    setTimeout(backgroundChaosLoop, delay);
}


function afterimageFlashLoop() {
    flash.style.opacity = 1;
    setTimeout(() => flash.style.opacity = 0, 16); // 1 frame flash
    

    const delay = (Math.random() * 3000 + 3000) / difficultyMultiplier;
    setTimeout(afterimageFlashLoop, delay);
}


function breathingKerningLoop() {

    const tracking = Math.random() * 40 - 20; // -20px to 20px
    container.style.letterSpacing = `${tracking}px`;
    
    setTimeout(breathingKerningLoop, 2000 / difficultyMultiplier);
}


document.getElementById('user-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        if (this.value.toUpperCase() === currentWord) {
            alert("Correct!");
            this.value = "";
            setupNewWord();
        } else {

            viewport.style.backgroundColor = "red";
            setTimeout(() => viewport.style.backgroundColor = "", 100);
            scrambledArray.sort(() => Math.random() - 0.5); // Instant punish
            this.value = "";
        }
    }
});

initGame();
