// Immediately invoked Function Expression (IIFE) for updating the display message
// Declares and exports a function that takes a message (string) and updates the display message div
const displayMessage = (() => {
    // Private variables and functions
   const updateDisplay = (message) => {
    document.querySelector("#display-message").innerHTML = message;
   }
  
    // Expose public methods
    return {
        updateDisplay,
    };
  })();

// Immediately invoked Function Expression (IIFE) for the physical Gameboard
const Gameboard = (() => {
    // Private variables and functions
    // Defines the Gameboard in an array
   let gameboard = ["","","","","","","","",""];
  
    // Declares and explorts a function that renders the board - loops over gamboard and creates a div item at each idex, and inserts the HTML into the gamebaord itself.
    // Add an event listener to each of the sqaures for handling a click event (adding 'x' or 'o').
    const renderBoard = () => {
        let boardHTML = "";
        for (let i = 0; i < gameboard.length; i++) {
            boardHTML += `<div class="square" id="square-${i}">${gameboard[i]}</div>`
        }
        document.querySelector("#gameboard").innerHTML = boardHTML;
        const squares = document.querySelectorAll(".square");
        squares.forEach(square => {
            square.addEventListener("click", Game.handleClick);
        });
    }

    // Declares and exports an update function that takes the index and a value, and updates the gameboard at given index before re-rendering
    const updateBoardItem = (index, value) => {
        gameboard[index] = value;
        renderBoard();
    }

    // Declares and exports a function for returning the gameboard itself
    const getGameboard = () => gameboard;

    const resetGameboard = () => gameboard = ["","","","","","","","",""];

    // Expose public methods
    return {
        getGameboard,
        renderBoard,
        updateBoardItem,
        resetGameboard,
    };
  })();


// Factory function that takes two params - name, mark and returns an object
const createPlayer = (name, mark) => ({
    name,
    mark
  });


// Creates and exports a function for restarting the game

// Immediately invoked Function Expression (IIFE) for the game logic itself
const Game = (() => {
    // Private variables and functions
    // Creates variables for players (an array), an index for defining who's turn it is, and a boolean varaible for deciding is the game is over or not
    let players = [];
    let currentTurn;
    let gameOver = false;

    // Creates a variable for starting the game which creates two players based on the values in each of the input fields, sets current turn to 0, gameOver to false, and renders the gameboard
    const startGame = () => {
        let player1 = createPlayer(document.querySelector("#player1").value, "X");
        let player2 = createPlayer(document.querySelector("#player2").value, "O");
        players = [player1, player2];
        currentTurn = 0;
        gameOver = false;
        Gameboard.renderBoard();
    }

    // Creates and exports the handle click event that first returns if the game is over, creates an index variable from the target, updates the gameboard with the players mark at the index, checks if there's a winner, and toggles the player turn variable
    const handleClick = (event) => {
        if (gameOver) {
            return;
        }
        let index = parseInt(event.target.id.split("-")[1]);

        if (Gameboard.getGameboard()[index] !== '') {
            return;
        }

        Gameboard.updateBoardItem(index, players[currentTurn].mark);
        console.log(Gameboard.getGameboard());

       

        if (checkWinner(Gameboard.getGameboard())) {
            console.log('Winner!');
            displayMessage.updateDisplay(players[currentTurn].name + " wins!");
            startButton.addEventListener("click", startGame);
            gameOver = true;
        }

        if (checkTie(Gameboard.getGameboard())) {
            console.log("Tie!");
            startButton.addEventListener("click", startGame);
            gameOver= true;
        }

        if (currentTurn === 0) {
            currentTurn = 1;  
        } else {
            currentTurn = 0;
        }
    }


    const getPlayers = () => players;

    // Expose public methods
    return {
        startGame,
        handleClick,
        getPlayers,
    };
  })();


// Normal function that creates an array of arrays of winning combinations, loops ofver them and checks if each value at the index is the same, and either declares a winner or doesn't
const checkWinner = (board) => {
    const winningCombinations = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ]
    for (let i = 0; i < winningCombinations.length; i++) {
        [a,b,c] = winningCombinations[i];
        if (board[a] !== '' && board[a] === board[b] && board[a] === board[c]) {
            return true;
        } 
    }
    return false;
};

// Normal function for checking for a tie
const checkTie = (board) => {
    return board.every(mark => mark !== '');
};

// Creation of restart game logic and on click event
const restartButton = document.querySelector("#restart-game");
restartButton.addEventListener("click", () => {
    gameOver = false;
    document.querySelector("#gameboard").innerHTML = "";
    document.querySelector("#player1").value = "";
    document.querySelector("#player2").value = "";
    displayMessage.updateDisplay("");
    Gameboard.resetGameboard();
    startButton.addEventListener("click", startGame);
});

// Creation of variable for start button & addition of on click event to begin the game
const startButton = document.querySelector("#start-game");
const startGame = () => {
    Game.startGame();
};
startButton.addEventListener("click", startGame);