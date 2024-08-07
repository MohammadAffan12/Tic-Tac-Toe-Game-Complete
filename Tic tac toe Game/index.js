const resetButton = document.querySelector("#reset-btn");
const newGameBtn = document.querySelector('#newgame-btn');
const turnMsg = document.querySelector("#turn-msg");
const gameContainer = document.querySelector(".game");
const gridSizeSelect = document.getElementById("grid-size");
const winningBoxesInput = document.getElementById("winning-boxes"); // Add this line

let gridSize = 3; // Default grid size
let winningBoxes = 3; // Default winning boxes
let winPatterns = [];

const gameState = {
    board: [],
    currentPlayer: "X",
    isGameOver: false,
    winner: null,
    winningPattern: null,
};

const setWinningPatterns = () => {
    winPatterns = []; // Reset win patterns
    winningBoxes = Number(winningBoxesInput.value); // Get winning boxes from input

    // Validate winning boxes
    if (winningBoxes < 2 || winningBoxes > gridSize) {
        alert("Winning boxes must be between 2 and the grid size.");
        return;
    }

    // Rows
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j <= gridSize - winningBoxes; j++) {
            const row = [];
            for (let k = 0; k < winningBoxes; k++) {
                row.push(i * gridSize + (j + k)); 
            }
            winPatterns.push(row);
        }
    }

    // Columns
    for (let i = 0; i <= gridSize - winningBoxes; i++) {
        for (let j = 0; j < gridSize; j++) {
            const col = [];
            for (let k = 0; k < winningBoxes; k++) {
                col.push((i + k) * gridSize + j);
            }
            winPatterns.push(col);
        }
    }

    
    for (let i = 0; i <= gridSize - winningBoxes; i++) {
        for (let j = 0; j <= gridSize - winningBoxes; j++) { //Diagonal
            const mainDiagonal = [];
            for (let k = 0; k < winningBoxes; k++) {
                mainDiagonal.push((i + k) * (gridSize + 1) + j);
            }
            winPatterns.push(mainDiagonal);
        }
    }

    
    for (let i = 0; i <= gridSize - winningBoxes; i++) {
        for (let j = winningBoxes - 1; j < gridSize; j++) { //Anti Diagonal 
            const antiDiagonal = []; 
            for (let k = 0; k < winningBoxes; k++) {
                antiDiagonal.push((i + k) * (gridSize - 1) + (j - k));
            }
            winPatterns.push(antiDiagonal);
        }
    }


   

};

// Function to render the game board
const renderGameBoard = () => {
    gameContainer.innerHTML = ""; // Clear previous board
    const totalBoxes = gridSize * gridSize; // Calculate total boxes based on grid size
    gameState.board = Array(totalBoxes).fill(""); // Initialize board

    
    gameContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`; // Set grid columns

    for (let i = 0; i < totalBoxes; i++) {
        const button = document.createElement("button");
        button.classList.add("box");
        button.setAttribute("aria-label", `Tic Tac Toe box ${i + 1}`);
        gameContainer.appendChild(button);

        // Event listener for each box
        button.addEventListener("click", () => {
            if (gameState.board[i] === "" && !gameState.isGameOver) {
                gameState.board[i] = gameState.currentPlayer;
                const hasWinner = checkWinner(gameState.currentPlayer);
                render(); // Rerender the game state
                if (!hasWinner) {
                    gameState.currentPlayer = gameState.currentPlayer === "X" ? "O" : "X"; // Change turn
                }
            }
        });
    }

    resetGame(); // Reset game state
};

// Render the game
const render = () => {
    const boxes = document.querySelectorAll(".box");
    boxes.forEach((box, index) => {
        box.innerHTML = gameState.board[index];
        box.disabled = gameState.board[index] !== "";
        box.style.backgroundColor = ""; // Reset background color
    });

    if (gameState.isGameOver) {
        if (gameState.winner) {
            turnMsg.innerText = `Player ${gameState.winner} wins!`;
            highlightWinningBoxes(gameState.winningPattern);
        } else {
            turnMsg.innerText = "It's a draw";
        }
    } else {
        turnMsg.innerText = `Turn for Player ${gameState.currentPlayer}`;
    }
};


const checkWinner = (player) => {
    for (let pattern of winPatterns) {
        if (pattern.every(index => gameState.board[index] === player)) {
            gameState.isGameOver = true; // Set game over to true
            gameState.winner = player; // Set the winner
            gameState.winningPattern = pattern; // Save the winning pattern
            return true; // Return true for winning
        }
    }
    if (gameState.board.every(box => box !== "")) {
        gameState.isGameOver = true; // Set game over to true
        gameState.winner = null; // No winner for draw
        return true; 
    }
    return false; // No winner
};

// Highlight the winning boxes
const highlightWinningBoxes = (winningPattern) => {
    if (winningPattern) {
        winningPattern.forEach(index => {
            const boxes = document.querySelectorAll(".box");
            boxes[index].style.backgroundColor = "lightgreen";
        });
    }
};

// Reset the game state
// const resetGame = () => {
//     gameState.currentPlayer = "X";
//     gameState.isGameOver = false;
//     gameState.winner = null;
//     gameState.winningPattern = null;
//     render(); // Rerender to reset state
// };

// Event listeners for buttons
newGameBtn.addEventListener("click", () => {
    setWinningPatterns();
    renderGameBoard();
});

//resetButton.addEventListener("click", resetGame);

// Event listener for grid size change
gridSizeSelect.addEventListener("change", (e) => {
    gridSize = Number(e.target.value);
    setWinningPatterns();
    renderGameBoard();
});

// Event listener for winning boxes change
winningBoxesInput.addEventListener("change", (e) => {
    setWinningPatterns(); // Recalculate winning patterns
    renderGameBoard(); // Re-render game board
});

// Initial setup
setWinningPatterns();
renderGameBoard();
