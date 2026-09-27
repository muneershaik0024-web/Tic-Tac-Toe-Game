// 🔥 NEW: Registering Mobile Web PWA App Service Worker Handler
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('sw.js').catch(function(err) { console.log(err); });
    });
}

// Selecting Document DOM Node Elements
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('statusText');
const resetBtn = document.getElementById('resetBtn');

// Score board element links handles
const scoreXElement = document.getElementById('scoreX');
const scoreOElement = document.getElementById('scoreO');
const scoreTiesElement = document.getElementById('scoreTies');

// Core application runtime parameters trackers
let activePlayerSign = 'X'; 
let runningGameStatus = true;
let virtualMatrixState = ["", "", "", "", "", "", "", "", ""];

// Score board local counters data reference points
let winCountX = 0;
let winCountO = 0;
let tieCount = 0;

// Core cell interactive click handler control routines
function onCellClickTrigger(event) {
    let targetCellNode = event.target;
    
    if (!targetCellNode.classList.contains('cell')) {
        targetCellNode = targetCellNode.parentElement;
    }
    
    const targetCellIndex = parseInt(targetCellNode.getAttribute('data-index'));

    if (virtualMatrixState[targetCellIndex] !== "" || !runningGameStatus) {
        return;
    }

    virtualMatrixState[targetCellIndex] = activePlayerSign;
    
    if (activePlayerSign === 'X') {
        targetCellNode.innerHTML = `<span class="x-color">🔥</span>`;
    } else {
        targetCellNode.innerHTML = `<span class="o-color">❄️</span>`;
    }

    evaluateMatrixPatternsLogic();
}

// FIXED WINNING PATTERNS CONDITION MATRIX CHECKER WITH AUTOMATIC DELAY WIPE
function evaluateMatrixPatternsLogic() {
    let matchWonFound = false;
    let winCoordinate1 = 0, winCoordinate2 = 0, winCoordinate3 = 0;
    const m = virtualMatrixState; 

    // Horizontal Row validation checks
    if (m[0] !== "" && m[0] === m[1] && m[1] === m[2]) { matchWonFound = true; winCoordinate1=0; winCoordinate2=1; winCoordinate3=2; }
    else if (m[3] !== "" && m[3] === m[4] && m[4] === m[5]) { matchWonFound = true; winCoordinate1=3; winCoordinate2=4; winCoordinate3=5; }
    else if (m[6] !== "" && m[6] === m[7] && m[7] === m[8]) { matchWonFound = true; winCoordinate1=6; winCoordinate2=7; winCoordinate3=8; }
    
    // Vertical Column validation checks
    else if (m[0] !== "" && m[0] === m[3] && m[3] === m[6]) { matchWonFound = true; winCoordinate1=0; winCoordinate2=3; winCoordinate3=6; }
    else if (m[1] !== "" && m[1] === m[4] && m[4] === m[7]) { matchWonFound = true; winCoordinate1=1; winCoordinate2=4; winCoordinate3=7; }
    else if (m[2] !== "" && m[2] === m[5] && m[5] === m[8]) { matchWonFound = true; winCoordinate1=2; winCoordinate2=5; winCoordinate3=8; }
    
    // Diagonal Crossing Intersection validation checks
    else if (m[0] !== "" && m[0] === m[4] && m[4] === m[8]) { matchWonFound = true; winCoordinate1=0; winCoordinate2=4; winCoordinate3=8; }
    else if (m[2] !== "" && m[2] === m[4] && m[4] === m[6]) { matchWonFound = true; winCoordinate1=2; winCoordinate2=4; winCoordinate3=6; }

    if (matchWonFound) {
        const currentEmoji = activePlayerSign === 'X' ? '🔥 X' : '❄️ O';
        const textGlowClass = activePlayerSign === 'X' ? 'x-color' : 'o-color';
        statusText.innerHTML = `🎉 Player <span class="${textGlowClass}">${currentEmoji}</span> Wins!`;
        runningGameStatus = false;

        if (activePlayerSign === 'X') {
            winCountX++;
            scoreXElement.innerText = winCountX;
        } else {
            winCountO++;
            scoreOElement.innerText = winCountO;
        }

        // Trigger Local Celebration Blast
        triggerOfflineCelebrationBlast();

        cells[winCoordinate1].classList.add('winning-strike');
        cells[winCoordinate2].classList.add('winning-strike');
        cells[winCoordinate3].classList.add('winning-strike');

        setTimeout(() => {
            clearGameField();
        }, 1500);
        return;
    }

    let matchTiedResult = !virtualMatrixState.includes("");
    if (matchTiedResult) {
        statusText.innerHTML = `🤝 Game Draw! Match Tied!`;
        runningGameStatus = false;
        
        tieCount++;
        scoreTiesElement.innerText = tieCount;

        setTimeout(() => {
            clearGameField();
        }, 1500);
        return;
    }

    activePlayerSign = activePlayerSign === 'X' ? 'O' : 'X';
    const activeEmojiLabel = activePlayerSign === 'X' ? '🔥 X' : '❄️ O';
    const dynamicTurnColorClass = activePlayerSign === 'X' ? 'x-color' : 'o-color';
    statusText.innerHTML = `Player <span class="${dynamicTurnColorClass}">${activeEmojiLabel}</span>'s Turn`;
}

// Pure JavaScript Offline Confetti Blast Generator Engine
function triggerOfflineCelebrationBlast() {
    const particleColors = ['#ff007f', '#00d2ff', '#28a745', '#ff9f43', '#7928ca', '#ffeb3b'];
    
    for (let i = 0; i < 120; i++) {
        const particle = document.createElement('div');
        particle.classList.add('confetti-particle');
        
        particle.style.backgroundColor = particleColors[Math.floor(Math.random() * particleColors.length)];
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = -20 + 'px';
        
        const sizeFactor = Math.random() * 8 + 6;
        particle.style.width = sizeFactor + 'px';
        particle.style.height = sizeFactor + 'px';
        
        particle.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
        particle.style.animationDelay = (Math.random() * 0.4) + 's';
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 3500);
    }
}

function clearGameField() {
    activePlayerSign = 'X';
    runningGameStatus = true; 
    virtualMatrixState = ["", "", "", "", "", "", "", "", ""];
    statusText.innerHTML = `Player <span class="x-color">🔥 X</span>'s Turn`;
    
    cells.forEach(singleCellNode => {
        singleCellNode.innerHTML = "";
        singleCellNode.classList.remove('winning-strike');
    });
}

cells.forEach(singleCellNode => singleCellNode.addEventListener('click', onCellClickTrigger));
resetBtn.addEventListener('click', clearGameField);
