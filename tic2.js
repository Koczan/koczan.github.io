var ttt = {
  // (A) PROPERTIES
  board : [], // array to hold the current game

  // (B) RESET THE GAME
  reset : function () {
    // (B1) RESET BOARD ARRAY & GET HTML CONTAINER
    ttt.board = [];
    var container = document.getElementById("ttt-game");
    container.innerHTML = "";

    // (B2) REDRAW SQUARES
    for (let i=0; i<9; i++) {
      ttt.board.push(null);
      var square = document.createElement("div");
      square.innerHTML = "&nbsp;";
      square.dataset.idx = i;
      square.id = "ttt-" + i;
      square.addEventListener("click", ttt.play);
      container.appendChild(square);
    }
  },

  // (C) PLAY - WHEN THE PLAYER SELECTS A SQUARE
  play : function () {
    // (C1) PLAYER'S MOVE - MARK WITH "O"
    var move = this.dataset.idx;
    ttt.board[move] = 0;
    this.innerHTML = "O"
    this.classList.add("player");
    this.removeEventListener("click", ttt.play);

    // (C2) NO MORE MOVES AVAILABLE - Remis!
    if (ttt.board.indexOf(null) == -1) {
      alert("Remis!");
      ttt.reset();
    }

    // (C3) COMPUTER'S MOVE - MARK WITH "X"
    // @TODO - Change to use not bad AI if you want
    else {
      move = ttt.dumbAI();
      //move = ttt.notBadAI(); 
      ttt.board[move] = 1;
      var square = document.getElementById("ttt-" + move);
      square.innerHTML = "X"
      square.classList.add("computer");
      square.removeEventListener("click", ttt.play);
    }

    // (C4) WHO WON?
    win = null;
    
    // HORIZONTAL ROW CHECKS
    for (let i=0; i<9; i+=3) {
      if (ttt.board[i]!=null && ttt.board[i+1]!=null && ttt.board[i+2]!=null) {
        if ((ttt.board[i] == ttt.board[i+1]) && (ttt.board[i+1] == ttt.board[i+2])) { win = ttt.board[i]; }
      }
      if (win !== null) { break; }
    }
    
    // VERTICAL ROW CHECKS
    if (win === null) {
      for (let i=0; i<3; i++) {
        if (ttt.board[i]!=null && ttt.board[i+3]!=null && ttt.board[i+6]!=null) {
          if ((ttt.board[i] == ttt.board[i+3]) && (ttt.board[i+3] == ttt.board[i+6])) { win = ttt.board[i]; }
          if (win !== null) { break; }
        }
      }
    }
    
    // DIAGONAL ROW CHECKS
    if (win === null) {
      if (ttt.board[0]!=null && ttt.board[4]!=null && ttt.board[8]!=null) {
        if ((ttt.board[0] == ttt.board[4]) && (ttt.board[4] == ttt.board[8])) { win = ttt.board[4]; }
      }
    }
    if (win === null) {
      if (ttt.board[2]!=null && ttt.board[4]!=null && ttt.board[6]!=null) {
        if ((ttt.board[2] == ttt.board[4]) && (ttt.board[4] == ttt.board[6])) { win = ttt.board[4]; }
      }
    }

    // WE HAVE A WINNER
    if (win !== null) {
      alert("Wygrywa - " + (win==0 ? "Gracz!" : "Komputer :O"));
      ttt.reset();
    }
  },

  // (D) DUMB COMPUTER AI, RANDOMLY CHOOSES AN EMPTY SLOT
  dumbAI : function () {
    // (D1) EXTRACT OUT ALL OPEN SLOTS
    var open = [];
    for (let i=0; i<9; i++) {
      if (ttt.board[i] === null) { open.push(i); }
    }

    // (D2) RANDOMLY CHOOSE OPEN SLOT
    var random = Math.floor(Math.random() * (open.length-1));
    return open[random];
  },

  // (E) AI WITH A LITTLE MORE INTELLIGENCE
  notBadAI : function () {
    // (E1) INIT
    var move = null;
    var check = function(first, direction, pc) {
    // CHECK() : HELPER FUNCTION, CHECK POSSIBLE WINNING ROW
    //  first : first square number
    //  direction : "R"ow, "C"ol, "D"iagonal
    //  pc : 0 for player, 1 for computer

      var second = 0, third = 0;
      if (direction=="R") {
        second = first + 1;
        third = first + 2;
      } else if (direction=="C") {
        second = first + 3;
        third = first + 6;
      } else {
        second = 4;
        third = first==0 ? 8 : 6;
      }

      if (ttt.board[first]==null && ttt.board[second]==pc && ttt.board[third]==pc) {
        return first;
      } else if (ttt.board[first]==pc && ttt.board[second]==null && ttt.board[third]==pc) {
        return second;
      } else if (ttt.board[first]==pc && ttt.board[second]==pc && ttt.board[third]==null) {
        return third;
      }
      return null;
    };

    // (E2) PRIORITY #1 - GO FOR THE WIN
    // CHECK HORIZONTAL ROWS
    for (let i=0; i<9; i+=3) {
      move = check(i, "R", 1);
      if (move!==null) { break; }
    }
    // CHECK VERTICAL COLUMNS
    if (move===null) {
      for (let i=0; i<3; i++) {
        move = check(i, "C", 1);
        if (move!==null) { break; }
      }
    }
    // CHECK DIAGONAL
    if (move===null) { move = check(0, "D", 1); }
    if (move===null) { move = check(2, "D", 1); }

    // (E3) PRIORITY #2 - BLOCK PLAYER FROM WINNING
    // CHECK HORIZONTAL ROWS
    for (let i=0; i<9; i+=3) {
      move = check(i, "R", 0);
      if (move!==null) { break; }
    }
    // CHECK VERTICAL COLUMNS
    if (move===null) {
      for (let i=0; i<3; i++) {
        move = check(i, "C", 0);
        if (move!==null) { break; }
      }
    }
    // CHECK DIAGONAL
    if (move===null) { move = check(0, "D", 0); }
    if (move===null) { move = check(2, "D", 0); }

    // (E4) RANDOM MOVE IF NOTHING
    if (move===null) { move = ttt.dumbAI(); }
    return move;
  }
};
window.addEventListener("load", ttt.reset);