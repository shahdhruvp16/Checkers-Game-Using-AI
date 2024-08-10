// script.js

const board = document.getElementById('board');
const cells = [];
let timerInterval;
let seconds = 0;
let history = [];
let currentPlayer = 'red';
let selectedPiece = null;

function createBoard() {
    for (let i = 0; i < 64; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        board.appendChild(cell);
        cells.push(cell);

        const row = Math.floor(i / 8);
        const col = i % 8;
        
        if ((row + col) % 2 === 1) { // dark squares
            cell.style.backgroundColor = '#b58863';
            if (row < 3) createPiece(cell, 'black');
            if (row > 4) createPiece(cell, 'red');
        } else { // light squares
            cell.style.backgroundColor = '#f0d9b5';
        }
    }
}

function createPiece(cell, color) {
    const piece = document.createElement('div');
    piece.classList.add('piece', color);
    cell.appendChild(piece);
}

function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const displaySeconds = seconds % 60;
        document.getElementById('timer').textContent = `Time: ${String(minutes).padStart(2, '0')}:${String(displaySeconds).padStart(2, '0')}`;
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    seconds = 0;
    document.getElementById('timer').textContent = 'Time: 00:00';
    startTimer();
}

function handleCellClick(event) {
    const cell = event.target.closest('.cell');
    if (!cell) return;

    const piece = cell.querySelector('.piece');
    if (piece && piece.classList.contains(currentPlayer)) {
        selectPiece(piece);
    } else if (cell.classList.contains('highlight')) {
        movePiece(cell);
    }
}

function selectPiece(piece) {
    clearHighlights();
    selectedPiece = piece;
    const cell = piece.parentElement;
    cell.classList.add('highlight');
    highlightMoves(cell);
}

function highlightMoves(cell) {
    const index = Number(cell.dataset.index);
    const directions = currentPlayer === 'red' ? [-9, -7, -18, -14] : [9, 7, 18, 14];

    directions.forEach(dir => {
        const targetIndex = index + dir;
        if (isValidMove(index, targetIndex, dir)) {
            cells[targetIndex].classList.add('highlight');
        }
    });
}

function isValidMove(fromIndex, toIndex, direction) {
    if (toIndex < 0 || toIndex >= 64) return false;

    const fromRow = Math.floor(fromIndex / 8);
    const toRow = Math.floor(toIndex / 8);
    const step = Math.abs(direction) > 10 ? 2 : 1;

    if (Math.abs(fromRow - toRow) !== step) return false;
    if (cells[toIndex].querySelector('.piece')) return false;

    if (step === 2) { // capture move
        const middleIndex = (fromIndex + toIndex) / 2;
        const middlePiece = cells[middleIndex].querySelector('.piece');
        if (!middlePiece || middlePiece.classList.contains(currentPlayer)) return false;
    }

    return true;
}

function movePiece(targetCell) {
    const fromCell = selectedPiece.parentElement;
    const fromIndex = Number(fromCell.dataset.index);
    const toIndex = Number(targetCell.dataset.index);

    const step = Math.abs(toIndex - fromIndex) > 10 ? 2 : 1;

    if (step === 2) {
        const middleIndex = (fromIndex + toIndex) / 2;
        const middleCell = cells[middleIndex];
        const middlePiece = middleCell.querySelector('.piece');
        if (middlePiece) middleCell.removeChild(middlePiece);
    }

    targetCell.appendChild(selectedPiece);
    history.push({ from: fromIndex, to: toIndex });

    promotePiece(selectedPiece, toIndex);
    clearHighlights();
    switchPlayer();
}

function promotePiece(piece, index) {
    const row = Math.floor(index / 8);
    if ((currentPlayer === 'red' && row === 0) || (currentPlayer === 'black' && row === 7)) {
        piece.classList.add('king');
        piece.textContent = 'K';
    }
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'red' ? 'black' : 'red';
}

function clearHighlights() {
    cells.forEach(cell => cell.classList.remove('highlight'));
}

document.getElementById('reset-btn').addEventListener('click', () => {
    resetTimer();
    board.innerHTML = '';
    cells.length = 0;
    createBoard();
});

document.getElementById('undo-btn').addEventListener('click', () => {
    if (history.length > 0) {
        const lastMove = history.pop();
        const fromCell = cells[lastMove.from];
        const toCell = cells[lastMove.to];
        const piece = toCell.querySelector('.piece');
        fromCell.appendChild(piece);
        if (lastMove.captured) {
            const middleCell = cells[(lastMove.from + lastMove.to) / 2];
            createPiece(middleCell, lastMove.captured);
        }
        switchPlayer();
    }
});

document.getElementById('home-btn').addEventListener('click', () => {
  window.location.href = 'main.html';
});

board.addEventListener('click', handleCellClick);

createBoard();
startTimer();
