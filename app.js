document.addEventListener("DOMContentLoaded", () => {
  // Code goes here
  const GRID_WIDTH = 10;
  const GRID_HEIGHT = 20;
  const GRID_SIZE = GRID_WIDTH * GRID_HEIGHT;

  const grid = createGrid();
  const width = 10;
  let square = Array.from(document.querySelectorAll(".grid div"));
  let nextRandom = 0;
  let timerId;
  let score = 0;
  const colors = [
    "url(images/blue_block.png)",
    "url(images/pink_block.png)",
    "url(images/purple_block.png)",
    "url(images/peach_block.png)",
    "url(images/yellow_block.png)",
  ];

  function createGrid() {
    // the main grid
    let grid = document.querySelector(".grid");
    for (let i = 0; i < GRID_SIZE; i++) {
      let gridElement = document.createElement("div");
      grid.appendChild(gridElement);
    }

    // set base of grid
    for (let i = 0; i < GRID_WIDTH; i++) {
      let gridElement = document.createElement("div");
      gridElement.setAttribute("class", "taken");
      grid.appendChild(gridElement);
    }

    let previousGrid = document.querySelector(".mini-grid");
    // Since 16 is the max grid size in which all the Tetrominoes
    // can fit in we create one here
    for (let i = 0; i < 16; i++) {
      let gridElement = document.createElement("div");
      previousGrid.appendChild(gridElement);
    }
    return grid;
  }

  const scoreDisplay = document.querySelector("#score");
  const startBtn = document.querySelector(".button-9");

  //The Tetrominoes
  const lTetromino = [
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, 2],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 2],
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2],
    [GRID_WIDTH, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2 + 2],
  ];

  const zTetromino = [
    [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
    [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1],
    [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
    [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1],
  ];

  const tTetromino = [
    [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2],
    [1, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
    [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
  ];

  const iTetromino = [
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3],
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3],
  ];

  const theTetrominoes = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];

  let currentPosition = 4;
  let currentRotation = 3;
  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][0];

  //draw first rotation in the first Tetromino
  function draw() {
    current.forEach((index) => {
      square[currentPosition + index].classList.add("tetromino");
      square[currentPosition + index].style.backgroundImage = colors[random];
    });
  }
  function unDraw() {
    current.forEach((index) => {
      square[currentPosition + index].classList.remove("tetromino");
      square[currentPosition + index].style.backgroundImage = "";
    });
  }

  function control(e) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      moveDown();
    }
  }
  document.addEventListener("keyup", control);

  // make tertrominoes move down every second
  //     timerId = setInterval(moveDown, 100);

  function moveDown() {
    unDraw();
    currentPosition = currentPosition += width;
    draw();
    frezze();
  }

  // frezze function
  function frezze() {
    if (
      current.some((index) =>
        square[currentPosition + index + width].classList.contains("taken")
      )
    ) {
      current.forEach((index) =>
        square[currentPosition + index].classList.add("taken")
      );

      // start a new tertromino falling
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }

  function moveLeft() {
    unDraw();
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % width === 0
    );

    if (!isAtLeftEdge) currentPosition -= 1;

    if (
      current.some((index) =>
        square[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition += 1;
    }
    draw();
  }

  function moveRight() {
    unDraw();
    const isAtRightEdge = current.some(
      (index) => (currentPosition + index) % width === width - 1
    );

    if (!isAtRightEdge) currentPosition += 1;

    if (
      current.some((index) =>
        square[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition -= 1;
    }
    draw();
  }

  function rotate() {
    unDraw();
    currentRotation++;
    if (currentRotation === current.length) {
      currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];
    draw();
  }

  // show up-next tertromino in mini-grid
  const displaySquares = document.querySelectorAll(".mini-grid div");
  const displayWidth = 4;
  let displayIndex = 0;

  // the tertromino withoout rotations
  const upNextTertetominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], // lTetromino
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // zTetromino
    [1, displayWidth + 1, displayWidth + 1, displayWidth + 2], // tTetromino
    [0, 1, displayWidth, displayWidth + 1], // oTetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], // iTetromino
  ];

  // display the shape in mini-grid

  function displayShape() {
    displaySquares.forEach((square) => {
      square.classList.remove("tetromino");
      square.style.backgroundImage = "none";
    });
    upNextTertetominoes[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add("tetromino");
      displaySquares[displayIndex + index].style.backgroundImage =
        colors[nextRandom];
    });
  }

  // add functionality to the button

  startBtn.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, 1000 / 3);
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      displayShape();
    }
  });

  // add score

  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];
      if (row.every((index) => square[index].classList.contains("taken"))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach((index) => {
          square[index].classList.remove("taken");
          square[index].classList.remove("tetromino");
        });

        const squareRemoved = square.splice(i, width);
        square = squareRemoved.concat(square);
        square.forEach((cell) => {
          console.log(cell);
          grid.appendChild(cell);
          cell.style.backgroundImage = "";
        });
      }
    }
  }

  // Game over function
  function gameOver() {
    if (
      current.some((index) =>
        square[currentPosition + index].classList.contains("taken")
      )
    ) {
      scoreDisplay.innerHTML = "end";
      clearInterval(timerId);
    }
  }
});
