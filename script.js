let origboard;
const huPlayer = 'O'; // Use 'O' instead of '0' to avoid confusion
const aiPlayer = 'X';
const wincombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
];

const cells = document.querySelectorAll(".cell");

startGame();

function startGame() {
    document.querySelector(".endgame").style.display = 'none';
    origboard = Array.from(Array(9).keys());
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener("click", turnClick, false);
    }
}

function turnClick(square) {
    if (typeof origboard[square.target.id] == 'number') {
        turn(square.target.id, huPlayer);
        if (!checkWin(origboard, huPlayer) && !checkTie()) {
            setTimeout(() => {
                turn(bestSpot(), aiPlayer);
            }, 400); // 1000ms = 1 second
        }
    }
}

function turn(squareId, player) {
    origboard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(origboard, player);
    if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of wincombos.entries()) {
        if (win.every(elem => plays.includes(elem))) {
            gameWon = { index: index, player: player };
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for (let index of wincombos[gameWon.index]) {
        document.getElementById(index).style.background = gameWon.player === huPlayer ? "blue" : "red";
    }
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player === huPlayer ? "You Win!" : "You Lose!");
}

function declareWinner(who) {
    document.querySelector('.endgame').style.display = 'block';
    document.querySelector('.endgame .text').innerText = who;
}

function emptySquares(board = origboard) {
    return board.filter(s => typeof s == 'number');
}

function bestSpot() {
    return minimax(origboard, aiPlayer).index;
}

function checkTie() {
    if (emptySquares().length === 0) {
        for (let i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = 'green';
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Tie Game");
        return true;
    }
    return false;
}

function minimax(newboard, player) {
    let availSpots = emptySquares(newboard);

    if (checkWin(newboard, huPlayer)) {
        return { score: -10 };
    } else if (checkWin(newboard, aiPlayer)) {
        return { score: 20 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }

    let moves = [];

    for (let i = 0; i < availSpots.length; i++) {
        let move = {};
        move.index = newboard[availSpots[i]];

        newboard[availSpots[i]] = player;

        let result;
        if (player === aiPlayer) {
            result = minimax(newboard, huPlayer);
        } else {
            result = minimax(newboard, aiPlayer);
        }

        move.score = result.score;

        newboard[availSpots[i]] = move.index; // undo move

        moves.push(move);
    }

    let bestMove;
    if (player === aiPlayer) {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}
