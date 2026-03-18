const WORDS = [
    "hand", "unit", "open", "rave", "crisp", "eagle", "ore", "quiz", "whip", "heaven", "ice", "cloud",
    "bird", "light", "house", "tree", "river", "stone", "fire", "water", "earth", "wind", "star", "sun",
    "moon", "night", "day", "time", "space", "mind", "soul", "heart", "love", "hate", "peace", "war",
    "life", "death", "joy", "hope", "fear", "truth", "lie", "right", "wrong", "good", "bad", "laugh",
    "cry", "smile", "walk", "run", "jump", "fly", "swim", "dive", "sink", "float", "sail", "ride",
    "drive", "push", "pull", "lift", "drop", "throw", "catch", "hit", "miss", "say", "tell", "speak",
    "talk", "ask", "answer", "hear", "listen", "see", "look", "watch", "feel", "touch", "smell", "taste"
];

function getRandomWords(count) {
    let result = [];
    for(let i=0; i<count; i++) {
        result.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
    }
    return result.join(" ");
}

const textContainer = document.getElementById("text-container");
const timerDisplay = document.getElementById("timer");
const finalScoreDisplay = document.getElementById("final-score");
const tryAgainBtn = document.getElementById("try-again");

let timer = 60;
let timeRemaining = timer;
let timerInterval = null;
let isStarted = false;
let charIndex = 0;
let mistakes = 0;
// No hidden input per new HTML structure. We will listen on document.
let currentText = "";

function initGame() {
    isStarted = false;
    charIndex = 0;
    mistakes = 0;
    timeRemaining = timer;
    
    clearInterval(timerInterval);
    
    timerDisplay.innerText = `Time left: ${timeRemaining}s`;
    finalScoreDisplay.innerHTML = '';
    finalScoreDisplay.classList.add('hidden');
    textContainer.style.display = 'block';
    timerDisplay.style.display = 'block';
    tryAgainBtn.style.display = 'none'; // Initially hidden
    
    textContainer.innerHTML = "";
    currentText = getRandomWords(70);
    currentText.split("").forEach(char => {
        let span = document.createElement("span");
        span.innerText = char;
        textContainer.appendChild(span);
    });
    
    textContainer.querySelectorAll("span")[0].classList.add("active");
    textContainer.scrollLeft = 0;
}

function startTimer() {
    if(!isStarted) {
        isStarted = true;
        timerInterval = setInterval(() => {
            timeRemaining--;
            timerDisplay.innerText = `Time left: ${timeRemaining}s`;
            
            if(timeRemaining <= 0) {
                endGame();
            }
        }, 1000);
    }
}

function endGame() {
    clearInterval(timerInterval);
    
    let timeSpentMinutes = (timer - timeRemaining) / 60;
    if (timeSpentMinutes === 0) timeSpentMinutes = 1/60; 
    
    const spans = textContainer.querySelectorAll("span");
    let correctChars = 0;
    for (let i = 0; i < charIndex; i++) {
        if (spans[i].classList.contains("correct")) {
            correctChars++;
        }
    }

    const wpm = Math.round(((correctChars / 5) / timeSpentMinutes));
    
    textContainer.style.display = 'none';
    timerDisplay.style.display = 'none';
    
    finalScoreDisplay.classList.remove('hidden');
    finalScoreDisplay.innerHTML = `
        <div class="times-up-msg">Time's up!</div>
        <div class="wpm-score">Final WPM: <span id="wpm-value">${wpm}</span></div>
    `;
    
    tryAgainBtn.style.display = 'inline-block';
}

function handleTyping(e) {
    if (timeRemaining <= 0) return;
    
    // Ignore special keys that don't produce letters (except backspace)
    if (e.key.length > 1 && e.key !== 'Backspace') return;

    startTimer();
    
    const characters = textContainer.querySelectorAll("span");
    
    if (e.key === "Backspace") {
        if (charIndex > 0) {
            charIndex--;
            characters[charIndex].classList.remove("correct", "incorrect");
            characters.forEach(span => span.classList.remove("active"));
            characters[charIndex].classList.add("active");
            
            scrollText(characters[charIndex]);
        }
        return;
    }
    
    const typedChar = e.key;
    
    if (typedChar === characters[charIndex].innerText) {
        characters[charIndex].classList.add("correct");
        characters[charIndex].classList.remove("incorrect");
    } else {
        characters[charIndex].classList.add("incorrect");
        characters[charIndex].classList.remove("correct");
        mistakes++;
    }
    
    characters.forEach(span => span.classList.remove("active"));
    
    charIndex++;
    
    if (charIndex < characters.length) {
        characters[charIndex].classList.add("active");
        scrollText(characters[charIndex]);
    } else {
        endGame();
    }
}

function scrollText(activeSpan) {
    const containerWidth = textContainer.clientWidth;
    const spanLeft = activeSpan.offsetLeft;
    
    if (spanLeft > containerWidth / 2) {
        textContainer.scrollLeft = spanLeft - containerWidth / 2;
    } else {
        textContainer.scrollLeft = 0;
    }
}

document.addEventListener("keydown", handleTyping);
tryAgainBtn.addEventListener("click", initGame);

initGame();
