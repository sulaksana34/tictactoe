/**
 * TicTacToe v1.2.2
 * 
 * TicTacToe is a two-player game in which the objective
 * is to take turns and mark the correct spaces in a 3x3 grid.
 * Play against CPU or another player.
 * 
 * Simple, quick, fun!
 * 
 * Copyright (c) 2022 Agung Sulaksana <sulaksana34@gmail.com>
 * 
 */

if(!sessionStorage.getItem("tictactoeData"))
  sessionStorage.setItem("tictactoeData", JSON.stringify({ dualPlayer: false, p1Score: 0, p2Score: 0 }));

let { dualPlayer, p1Score, p2Score } = JSON.parse(sessionStorage.getItem("tictactoeData"));
const singlePlayerBtn = document.querySelector("#singlePlayer");
const dualPlayerBtn = document.querySelector("#dualPlayer");

const scoreBoard = document.querySelector(".scoreboard");

const winPattern = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const cornerSquare = [0, 2, 6, 8];

const players = dualPlayer ? ["Player 1", "Player 2"] : ["Player", "CPU"];
let player = 0;
let winCounter;
let wonPattern;

const container = document.querySelector(".container");
const squares = document.querySelectorAll(".container .square");
const squaresLength = squares.length;
const displayName = document.querySelector("#player");
displayName.innerHTML = players[player];

const turnBoard = document.querySelector(".turnboard");

const updateData = () => {
  scoreBoard.innerHTML = `
    <h4>${players[0]}: ${p1Score}</h3>
    <h4>${players[1]}: ${p2Score}</h3>
  `;
  sessionStorage.setItem("tictactoeData", JSON.stringify({ dualPlayer: dualPlayer, p1Score: p1Score, p2Score: p2Score }));
}

window.onload = () => {
  if(dualPlayer) {
    singlePlayerBtn.setAttribute("class", "btn btn-outline-primary");
    dualPlayerBtn.setAttribute("class", "btn btn-primary");
  } else {
    singlePlayerBtn.setAttribute("class", "btn btn-primary");
    dualPlayerBtn.setAttribute("class", "btn btn-outline-primary");
  }
  updateData();
}

singlePlayerBtn.addEventListener("click", () => {
  dualPlayer = false;
  p1Score = 0;
  p2Score = 0;
  updateData();
  window.location.reload();
})

dualPlayerBtn.addEventListener("click", () => {
  dualPlayer = true;
  p1Score = 0;
  p2Score = 0;
  updateData();
  window.location.reload();
})

const switchTurn = () => {
  player === 0 ? player = 1 : player = 0;

  displayName.innerHTML = players[player];
}

const disableClick = () => {
  squares.forEach(square => {
    square.style.cssText = "pointer-events: none;";
  })
}

const enableClick = () => {
  squares.forEach(square => {
    square.style.cssText = "pointer-events: auto;";
  })
}

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
}

const checkWin = () => {
  winPattern.forEach(patterns => {
    if(winCounter === 3)
      return

    winCounter = 0;
    for(let i = 0; i < patterns.length; i++) {
      if(!squares[patterns[i]].classList.contains(dualPlayer ? player === 0 ? "by_player0" : "by_player1" : player === 0 ? "by_player" : "by_cpu"))
        return

      winCounter += 1;
    }
    wonPattern = patterns;
  })

  if(winCounter < 3)
    return

  wonPattern.forEach(el => {
    squares[el].classList.add("won");
  })

  turnBoard.innerHTML = `
    <h2>${players[player]} won!</h2>
    <button class="btn btn-restart" onclick="window.location.reload();">Restart</button>
  `;
  container.classList.add("done");

  return true;
}

const checkDraw = () => {
  const availSquares = document.querySelectorAll(".container .square:not(.selected)");

  if(availSquares.length > 0)
    return

  turnBoard.innerHTML = `
    <h2>Draw!</h2>
    <button class="btn btn-restart" onclick="window.location.reload();">Restart</button>
  `;
  container.classList.add("done");
}

const findRandom = () => {
  const availSquares = document.querySelectorAll(".container .square:not(.selected)");

  if(availSquares.length === 0)
    return

  const index = getRandomInt(availSquares.length-1);
  availSquares[index].innerHTML = player === 0 ? "X" : "O";
  availSquares[index].classList.add("selected", "by_cpu");
}

const findCenter = () => {
  if(squares[4].classList.contains("selected"))
    return false;

  squares[4].innerHTML = player === 0 ? "X" : "O";
  squares[4].classList.add("selected", "by_cpu");

  return true;
}

const findCorner = () => {
  const targetSquare = [];

  cornerSquare.forEach(i => {
    targetSquare.push(squares[i]);
  })

  const availSquares = targetSquare.filter(el => {
    return !el.classList.contains("selected");
  })

  if(availSquares.length === 0)
    return false
  
  const index = getRandomInt(availSquares.length-1);
  availSquares[index].innerHTML = player === 0 ? "X" : "O";
  availSquares[index].classList.add("selected", "by_cpu");

  return true;
}

const checkSelected = (i) => {
  if(squares[i].classList.contains("by_player"))
    return true
}

const findBlock = (idx) => {
  let nextStep;

  switch(idx) {
    case 0:
      if(checkSelected(1))
        nextStep = 2;

      if(checkSelected(2))
        nextStep = 1;
      
      if(checkSelected(3))
        nextStep = 6;

      if(checkSelected(4))
        nextStep = 8;

      if(checkSelected(6))
        nextStep = 3;

      if(checkSelected(8))
        nextStep = 4;

      break;
    case 1:
      if(checkSelected(0))
        nextStep = 2;

      if(checkSelected(2))
        nextStep = 0;
      
      if(checkSelected(4))
        nextStep = 7;

      if(checkSelected(7))
        nextStep = 4;

      break;
    case 2:
      if(checkSelected(0))
        nextStep = 1;

      if(checkSelected(1))
        nextStep = 0;
      
      if(checkSelected(4))
        nextStep = 6;

      if(checkSelected(6))
        nextStep = 4;

      if(checkSelected(5))
        nextStep = 8;

      if(checkSelected(8))
        nextStep = 5;

      break;
    case 3:
      if(checkSelected(0))
        nextStep = 6;

      if(checkSelected(6))
        nextStep = 0;
      
      if(checkSelected(4))
        nextStep = 5;

      if(checkSelected(5))
        nextStep = 4;

      break;
    case 5:
      if(checkSelected(2))
        nextStep = 8;

      if(checkSelected(8))
        nextStep = 2;
      
      if(checkSelected(3))
        nextStep = 4;

      if(checkSelected(4))
        nextStep = 3;
        
      break;
    case 6:
      if(checkSelected(0))
        nextStep = 3;

      if(checkSelected(3))
        nextStep = 0;
      
      if(checkSelected(2))
        nextStep = 4;

      if(checkSelected(4))
        nextStep = 2;

      if(checkSelected(7))
        nextStep = 8;

      if(checkSelected(8))
        nextStep = 7;

      break;
    case 7:
      if(checkSelected(1))
        nextStep = 4;

      if(checkSelected(4))
        nextStep = 1;
      
      if(checkSelected(6))
        nextStep = 8;

      if(checkSelected(8))
        nextStep = 6;

      break;
    case 8:
      if(checkSelected(0))
        nextStep = 4;

      if(checkSelected(4))
        nextStep = 0;
      
      if(checkSelected(2))
        nextStep = 5;

      if(checkSelected(5))
        nextStep = 2;

      if(checkSelected(6))
        nextStep = 7;

      if(checkSelected(7))
        nextStep = 6;
        
      break;
    default:
      break;
  }

  if(nextStep === undefined)
    return false;

  if(squares[nextStep].classList.contains("selected"))
    return false;

  squares[nextStep].innerHTML = player === 0 ? "X" : "O";
  squares[nextStep].classList.add("selected", "by_cpu");

  return true;
}

const cpuTurn = (lastMove) => {
  if(player === 0)
    return

  disableClick();

  setTimeout(() => {
    if(!findCenter())
      if(!findBlock(lastMove))
        findCorner();

    if(checkWin()) {
      p2Score += 1;
      updateData();
      return
    }

    checkDraw();
    switchTurn();
    enableClick();
  }, 1000)
}

for(let i = 0; i < squaresLength; i++) {
  squares[i].addEventListener("click", () => {
    if(squares[i].classList.contains("selected"))
      return

    squares[i].innerHTML = player === 0 ? "X" : "O";
    squares[i].classList.add("selected", dualPlayer ? `by_player${player}` : "by_player");
    
    if(checkWin()) {
      player === 0 ? p1Score += 1 : p2Score += 1;
      updateData();
      return
    }

    checkDraw();
    switchTurn();

    if(!dualPlayer)
      cpuTurn(i);
  })
}