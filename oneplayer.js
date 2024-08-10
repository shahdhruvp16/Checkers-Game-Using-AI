class Checkers {
    constructor() {
        this.moveCounter = 0;
        this.piecesCaptured = {
            'player1': 0,
            'player2': 0
        };
        this.updateScoreboard();
        this.board = document.getElementById('board');
        this.squares = [];
        this.player1 = 'player1'; // Human player (red)
        this.player2 = 'player2'; // AI opponent (black)
        this.createBoard();
        this.placePieces();
        this.currentPlayer = this.player1;
        this.selectedPiece = null;
        this.possibleMoves = [];
        this.currentPlayerElement = document.getElementById('current-player');
    }
    updateScoreboard() {
      const movesElement = document.getElementById('moves');
      const currentPlayerElement = document.getElementById('current-player');
      const player1CapturesElement = document.getElementById('player1-captures');
      const player2CapturesElement = document.getElementById('player2-captures');
  
      movesElement.textContent = `Moves Played: ${this.moveCounter}`;
      currentPlayerElement.textContent = ` ${this.currentPlayer === this.player1 ? 'YOUR TURN' : 'AI TURN'}`;
      player1CapturesElement.textContent = `YOUR  Captures: ${this.piecesCaptured[this.player1] !== undefined ? this.piecesCaptured[this.player1] : '0'}`;
      player2CapturesElement.textContent = `AI Captures: ${this.piecesCaptured[this.player2] !== undefined ? this.piecesCaptured[this.player2] : '0'}`;
    
  }
      
  //board setup
  createBoard() {
    for (let i = 0; i < 64; i++) {
        const square = document.createElement('div');
        square.classList.add('square');
        square.dataset.index = i;
  
        if ((Math.floor(i / 8) % 2 === 0 && i % 2 ===             1) || (Math.floor(i / 8) % 2 === 1 && i % 2 === 0)) {
            square.classList.add('dark');
        } else {
            square.classList.add('light');
        }
  
        this.squares.push(square);
        this.board.appendChild(square);
    }
  }
  
  placePieces() {
    for (let i = 0; i < this.squares.length; i++) {
        const piece = document.createElement('div');
        piece.classList.add('piece');
  
        if (i < 24 && (Math.floor(i / 8) % 2 === 0 && i % 2 === 1) || (i < 24 && Math.floor(i / 8) % 2 === 1 && i % 2 === 0)) {
            piece.classList.add(this.player2);
            this.squares[i].appendChild(piece);
        }
        
        if (i >= 40 && (Math.floor(i / 8) % 2 === 0 && i % 2 === 1) || (i >= 40 && Math.floor(i / 8) % 2 === 1 && i % 2 === 0)) {
            piece.classList.add(this.player1);
            this.squares[i].appendChild(piece);
        }
        
    }
  }
  
  //piece logic
  isPieceSelectable(piece) {
    return piece.classList.contains(this.currentPlayer);
  }
  
  selectPiece(piece) {
    this.removeSelectedStyleFromAll(); 
    this.deselectPiece();
    this.hidePossibleMoves(this.possibleMoves);
    this.selectedPiece = piece;
    this.selectedPiece.classList.add('selected');
    this.possibleMoves = this.getPossibleMoves(this.selectedPiece);
  }
  
  deselectPiece() {
    if (this.selectedPiece) {
        this.selectedPiece.classList.remove('selected');
        this.selectedPiece = null;
    }
  }
  
  isMoveValid(oldIndex, newIndex, pieceColor) {
    const oldRow = Math.floor(oldIndex / 8);
    const newRow = Math.floor(newIndex / 8);
    const oldCol = oldIndex % 8;
    const newCol = newIndex % 8;
    const piece = this.squares[oldIndex].firstChild;
    const isKing = piece.classList.contains('king');
  
    if (newIndex < 0 || newIndex > 63) {
        return false;
    }
  
    if (Math.abs(oldRow - newRow) !== Math.abs(oldCol - newCol)) {
        return false;
    }
  
    if (!isKing) {
      if (pieceColor === this.player1 && newRow > oldRow) {
          return false;
      }
  
      if (pieceColor === this.player2 && newRow < oldRow) {
          return false;
      }
    }
  
    return true;
  }
  
  removeSelectedStyleFromAll() {
    for (const square of this.squares) {
      if (square.firstChild) {
        square.firstChild.classList.remove('selected');
      }
    }
  }
  
  //move logic          
  showPossibleMoves(moves) {
    console.log('Showing possible moves:', moves);
    this.hidePossibleMoves(this.possibleMoves);
    for (const move of moves) {
        const indicator = document.createElement('div');
        indicator.classList.add('move-indicator');
        move.appendChild(indicator);
    }
    this.possibleMoves = moves;
  }
  
  hidePossibleMoves(moves) {
    for (const move of moves) {
        const indicator = move.querySelector('.move-indicator');
        if (indicator) {
            move.removeChild(indicator);
        }
    }
  }
            
  getPossibleJumps(piece, initialCall = true) {
    const jumps = [];
    const pieceIndex = parseInt(piece.parentElement.dataset.index);
    const pieceColor = piece.classList.contains(this.player1) ? this.player1 : this.player2;
    const isKing = piece.classList.contains('king');
    const directions = isKing ? [-9, -7, 7, 9] : (pieceColor === this.player1 ? [-9, -7] : [7, 9]);
  
    for (let dir of directions) {
        const newIndex = pieceIndex + dir;
        const jumpedIndex = pieceIndex + 2 * dir;
  
        if (this.isMoveValid(pieceIndex, newIndex, pieceColor) && this.squares[newIndex] && this.squares[newIndex].firstChild &&
            this.squares[newIndex].firstChild.classList.contains(pieceColor === this.player1 ? this.player2 : this.player1) &&
            this.isMoveValid(pieceIndex, jumpedIndex, pieceColor) && this.squares[jumpedIndex] && !this.squares[jumpedIndex].firstChild) {
            jumps.push({ from: piece.parentElement, to: this.squares[jumpedIndex], jumped: this.squares[newIndex] });
            if (!initialCall) {
                jumps.push(...this.getPossibleJumps(this.squares[jumpedIndex].appendChild(piece), false));
            }
        }
    }
  
    return jumps;
  }
            
  getPossibleMoves(piece) {
      const possibleMoves = [];
      const pieceIndex = parseInt(piece.parentElement.dataset.index);
      const pieceColor = piece.classList.contains(this.player1) ? this.player1 : this.player2;
      const isKing = piece.classList.contains('king');
      const directions = isKing ? [-9, -7, 7, 9] : (pieceColor === this.player1 ? [-9, -7] : [7, 9]);
  
      for (let dir of directions) {
          const newIndex = pieceIndex + dir;
          const jumpedIndex = pieceIndex + 2 * dir;
  
          if (this.isMoveValid(pieceIndex, newIndex, pieceColor)) {
              if (this.squares[newIndex] && !this.squares[newIndex].firstChild) {
                  possibleMoves.push(this.squares[newIndex]);
              } else if (this.squares[newIndex] && this.squares[newIndex].firstChild &&
                      this.squares[newIndex].firstChild.classList.contains(pieceColor === this.player1 ? this.player2 : this.player1) &&
                      this.isMoveValid(pieceIndex, jumpedIndex, pieceColor) &&
                      this.squares[jumpedIndex] && !this.squares[jumpedIndex].firstChild) {
                  possibleMoves.push(this.squares[jumpedIndex]);
              }
          }
      }
  
      console.log('Possible moves for selected piece:', possibleMoves);
      return possibleMoves;
  }
     
  isGameOver() {
      const player1Pieces = this.squares.filter(square => square.firstChild && square.firstChild.classList.contains(this.player1));
      const player2Pieces = this.squares.filter(square => square.firstChild && square.firstChild.classList.contains(this.player2));
  
      if (player1Pieces.length === 0 || player2Pieces.length === 0) {
          return true;
      }
  
      const currentPlayerPieces = this.currentPlayer === this.player1 ? player1Pieces : player2Pieces;
      for (const piece of currentPlayerPieces) {
          const possibleMoves = this.getPossibleMoves(piece.firstChild);
          if (possibleMoves.length > 0) {
              return false;
          }
      }
  
      return true;
  }
  
  // turn logic
  canJumpAgain(piece) {
    const possibleJumps = this.getPossibleJumps(piece, false);
    return possibleJumps.length > 0;
  }
  
  async movePiece(targetSquare) {
    const newIndex = this.getSquareIndex(targetSquare);
    const oldIndex = this.getSquareIndex(this.selectedPiece.parentElement);
    const jumpedIndex = this.getJumpedIndex(oldIndex, newIndex);
  
    const isJump = Math.abs(newIndex - oldIndex) === 18 || Math.abs(newIndex - oldIndex) === 14;
  
    this.selectedPiece.remove();
    targetSquare.appendChild(this.selectedPiece);
  
    if (isJump) {
      this.squares[jumpedIndex].firstChild.remove();
      this.piecesCaptured[this.currentPlayer]++;
      this.updateScoreboard();
    }
  
    this.checkKingStatus(this.selectedPiece, newIndex);
  
    return isJump;
  }
  
  checkKingStatus(piece, squareIndex) {
    if (this.shouldBecomeKing(piece, squareIndex)) {
      this.makeKing(piece);
    }
  }
  
  //player turn logic
  async handleClick(square) {
    const piece = square.firstChild;
    if (piece && this.isPieceSelectable(piece)) {
      this.selectPiece(piece);
      this.showPossibleMoves(this.getPossibleMoves(piece));
    } else if (this.possibleMoves.includes(square)) {
      const isJump = await this.movePiece(square);
      if ((!isJump || !this.canJumpAgain(this.selectedPiece)) && !this.isGameOver()) {
        await this.switchTurn();
      } else if (this.canJumpAgain(this.selectedPiece)) {
        this.hidePossibleMoves(this.possibleMoves);
        this.possibleMoves = this.getPossibleJumps(this.selectedPiece);
        this.showPossibleMoves(this.possibleMoves);
      }
    }
  }
  
  
  currentPlayerPieces() {
    return this.squares
      .filter(square => square.firstChild && square.firstChild.classList.contains(this.currentPlayer))
      .map(square => square.firstChild);
  }
  
  async switchTurn() {
    this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
    this.deselectPiece();
    this.hidePossibleMoves(this.possibleMoves);
    this.possibleMoves = [];
  
    // Update the current player text
    this.currentPlayerElement.textContent = `Player: ${this.currentPlayer === this.player1 ? 'HUMAN' : 'AI'}`;
  
    if (this.currentPlayer === this.player2) {
      // Add a one-second delay before the AI makes its move
      await new Promise(resolve => setTimeout(resolve, 1000));
      await this.performAIMove();
      if (!this.isGameOver()) {
        await this.switchTurn();
      }
    }
  }
  
  getSquareIndex(square) {
    return parseInt(square.dataset.index);
  }
  
  getJumpedIndex(oldIndex, newIndex) {
    return (oldIndex + newIndex) / 2;
  }
  
  shouldBecomeKing(piece, squareIndex) {
    if (piece.classList.contains('player1') && squareIndex >= 0 && squareIndex <= 7) {
      return true;
    }
  
    if (piece.classList.contains('player2') && squareIndex >= 56 && squareIndex <= 63) {
      return true;
    }
  
    return false;
  }
  
  makeKing(piece) {
    piece.classList.add('king');
  }
    
  checkKingStatus(piece, squareIndex) {
    const pieceColor = piece.classList.contains(this.player1) ? this.player1 : this.player2;
    const pieceRow = Math.floor(squareIndex / 8);
  
    // Check if a piece has reached the opposite end of the board and if so, make it a king.
    if ((pieceColor === this.player1 && pieceRow === 0) || (pieceColor === this.player2 && pieceRow === 7)) {
      piece.classList.add('king');
    }
  }
  
  // AI-related methods  
  getAIMove() {
      const availablePieces = this.squares
          .filter(square => square.firstChild && square.firstChild.classList.contains(this.currentPlayer))
          .map(square => square.firstChild);
  
      const piecesWithMoves = availablePieces
          .map(piece => ({ piece, moves: this.getPossibleMoves(piece) }))
          .filter(obj => obj.moves.length > 0);
  
      if (piecesWithMoves.length === 0) {
          return null;
      }
  
      const randomIndex = Math.floor(Math.random() * piecesWithMoves.length);
      const randomPieceWithMoves = piecesWithMoves[randomIndex];
  
      return randomPieceWithMoves;
  }
  
  
  
  async performAIMove() {
    return new Promise(async (resolve) => {
      const aiMove = this.getAIMove();
  
      if (aiMove) {
        this.selectPiece(aiMove.piece);
        const randomMoveIndex = Math.floor(Math.random() * aiMove.moves.length);
        const targetSquare = aiMove.moves[randomMoveIndex];
        const isJump = await this.movePiece(targetSquare);
        console.log('AI move:', targetSquare);
        
        if (isJump && this.canJumpAgain(this.selectedPiece)) {
          this.showPossibleMoves(this.getPossibleJumps(this.selectedPiece));
          await new Promise(r => setTimeout(r, 1000));
          await this.performAIMove();
        }
        
        resolve();
      } else {
        console.log('Game Over! Winner:', this.currentPlayer === this.player1 ? this.player2 : this.player1);
        throw new Error('No valid AI moves');
      }
    });
  }
  
          
  }

  document.getElementById('home-btn').addEventListener('click', () => {
    window.location.href = 'main.html';
  });
  
  document.addEventListener('DOMContentLoaded', () => {
    const checkersGame = new Checkers();
  
    for (const square of checkersGame.squares) {
      square.addEventListener('click', () => checkersGame.handleClick(square));
    }
  });