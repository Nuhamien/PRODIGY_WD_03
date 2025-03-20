const chooseX = document.getElementById("choosex");
const chooseO = document.getElementById("chooseo");
const modeSelection = document.getElementById("modeSelection");
const playWithAi = document.getElementById("playWithAi");
const playWithHuman = document.getElementById("playWithHuman");
const cells = document.querySelectorAll(".cell");
const messageBox = document.getElementById("messageBox");
const messageText = document.getElementById("messageText");
const resetButton = document.getElementById("reset");


let playerSymbol = "";
let aiSymbol = "";
let currentPlayer = "";
let gameMode = "";
let gameActive = false;

document.addEventListener("DOMContentLoaded", function () {
    const storedMode = localStorage.getItem("gameMode");

    if (storedMode) {
        gameMode = storedMode;
        console.log("Game Mode Selected:", gameMode);

        // ✅ Show symbol selection after mode selection
        document.getElementById("symbolSelection").classList.remove("hidden");
    } else {
        console.error("No game mode selected! Redirecting...");
        window.location.href = "index.html"; // Redirect if no mode is selected
    }
});

function selectMode(mode) {
    localStorage.setItem("gameMode", mode);
    window.location.href = "home.html";
}


function startGame(symbol) {
    console.log(playerSymbol);
    if (!gameMode) {
        console.error("Game mode not selected!");  
        return;
    }

    playerSymbol = symbol.toUpperCase();
   
    aiSymbol = playerSymbol === "X" ? "O" : "X";
    currentPlayer = playerSymbol; //  Set current player correctly
    gameActive = true;

    setTimeout(() => {
        document.getElementById("symbolSelection").classList.add("hidden"); // Hide it properly
    }, 100);
    disableChoiceButtons();

   
}


// Ensure player symbol is selected before starting game
chooseX.addEventListener("click", () => startGame("X"));
chooseO.addEventListener("click", () => startGame("O"));

// Ensure computer move happens properly after player’s turn

cells.forEach(cell => {
    cell.addEventListener("click", function () {
        if (currentPlayer === "") {
            showWarningMessage("Please select your symbol before playing! ⚠️", "warning");
           return;
        }
        if (cell.textContent === "" && gameActive) {
            cell.textContent = currentPlayer;
            checkWinner();
            checkDraw();

            if (!gameActive) return;

            if (gameMode === "Human") {
                currentPlayer = currentPlayer === "X" ? "O" : "X"; 
            } else if (gameMode === "AI" && currentPlayer === playerSymbol) {
                currentPlayer = aiSymbol; //  Switch to AI turn
                setTimeout(computerMove, 500);
            }
        }
    });
});





function computerMove() {
    if (!gameActive) return;

    const emptyCells = [...cells].filter(cell => cell.textContent === "");
    if (emptyCells.length === 0) return;

    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    randomCell.textContent = aiSymbol;

    checkWinner();
    checkDraw();

    // ✅ Ensure turn switches back to the player
    if (gameActive) currentPlayer = playerSymbol;
}



const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function checkWinner() {
    for (let combo of winningCombinations) {
        const [a, b, c] = combo;
        if (cells[a].textContent && cells[a].textContent === cells[b].textContent && cells[a].textContent === cells[c].textContent) {
            gameActive = false;
            setTimeout(() => showMessage(`${cells[a].textContent} wins! 🎉`), 300);
            return;
        }
    }
}

function checkDraw() {
    if (!gameActive) return;
    const isDraw = [...cells].every(cell => cell.textContent !== "");
    if (isDraw) {
        gameActive = false;
        setTimeout(() => showMessage("It's a draw! 🤝"), Math.floor(Math.random() * 500) + 500);
    }
}

function disableChoiceButtons() {
    chooseX.disabled = true;
    chooseO.disabled = true;
    chooseX.style.display = "none";  
    chooseO.style.display = "none";  
}

function enableChoiceButtons() {
    chooseX.disabled = false;
    chooseO.disabled = false;
    chooseX.style.display = "block";  
    chooseO.style.display = "block";  
}

resetButton.addEventListener("click", function () {
    cells.forEach(cell => cell.textContent = "");
    gameActive = true;
    currentPlayer = ""; 
    enableChoiceButtons();
    messageBox.classList.add("hidden");

    // Reset game but keep selected mode
    if (gameMode) {
        document.getElementById("symbolSelection").classList.remove("hidden");
    } 
    
    else {
        window.location.href = "index.html"; // Redirect if mode is lost
    }
});




function showMessage(text) {
    messageText.textContent = text;
    messageBox.classList.remove("hidden");
    let exitButton = document.getElementById("exit");
   
    exitButton.addEventListener("click", function () {
        window.location.href = "index.html"; // Redirect to main page
    });

    // Ensure button is added only once
    if (!document.getElementById("exit")) {
        messageBox.appendChild(exitButton);
    }
}

function showWarningMessage(text) {
    const warningBox = document.getElementById("warningBox");
    const warningText = document.getElementById("warningText");
    const okButton = document.getElementById("ok");

    warningText.textContent = text;
    warningBox.classList.remove("hidden");

    // Remove old button and create a new one to avoid multiple listeners
    let newOkButton = okButton.cloneNode(true);
    okButton.replaceWith(newOkButton);

    newOkButton.addEventListener("click", function () {
        warningBox.classList.add("hidden"); // Hide warning instead of redirecting
    });
}


