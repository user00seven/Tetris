document.addEventListener("DOMContentLoaded", () => {
  // Code goes here
  const GRID_WIDTH = 11;
  const GRID_HEIGHT = 20;
  const GRID_SIZE = GRID_WIDTH * GRID_HEIGHT;

  const grid = createGrid();
  const width = 11;
  let square = Array.from(document.querySelectorAll(".grid div"));
  let nextRandom = 0;
  let nextRandomColor = 0;
  let timerId;
  let stop = false;
  let score = 0;
  const colors = ["yellow", "red", "orange", "purple", "green", "blue"];

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
      gridElement.setAttribute("class", "base taken");
      grid.appendChild(gridElement);
    }

    let previousGrid = document.querySelector(".mini-grid");
    // Since 16 is the max grid size in which all the Tetrominoes
    // can fit in we create one here
    for (let i = 0; i < 25; i++) {
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
  let randomColor = Math.floor(Math.random() * colors.length);
  let current = theTetrominoes[random][0];

  //draw first rotation in the first Tetromino
  function draw() {
    current.forEach((index) => {
      square[currentPosition + index].classList.add("tetromino");
      square[currentPosition + index].style.backgroundColor =
        colors[randomColor];
    });
  }
  function unDraw() {
    current.forEach((index) => {
      square[currentPosition + index].classList.remove("tetromino");
      square[currentPosition + index].style.backgroundColor = "";
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
    if (stop === false) {
      unDraw();
      currentPosition = currentPosition += width;
      draw();
      frezze();
    }
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
      randomColor = nextRandomColor;
      nextRandomColor = Math.floor(Math.random() * colors.length);
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
    if (stop == false) {
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
  }

  function moveRight() {
    if (stop === false) {
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
  }

  function rotate() {
    if (stop === false) {
      unDraw();
      currentRotation++;
      if (currentRotation === current.length) {
        currentRotation = 0;
      }
      current = theTetrominoes[random][currentRotation];
      draw();
    }
  }

  // show up-next tertromino in mini-grid
  const displaySquares = document.querySelectorAll(".mini-grid div");
  const displayWidth = 5;
  let displayIndex = 6;

  // the tertromino withoout rotations
  const upNextTertetominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], // lTetromino
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // zTetromino
    [
      1,
      displayWidth + 1,
      displayWidth + 1,
      displayWidth + 2,
      displayWidth * 2 + 1,
    ], // tTetromino
    [0, 1, displayWidth, displayWidth + 1], // oTetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], // iTetromino
  ];

  // display the shape in mini-grid

  function displayShape() {
    displaySquares.forEach((square) => {
      square.classList.remove("tetromino");
      square.style.backgroundColor = "";
    });
    upNextTertetominoes[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add("tetromino");
      displaySquares[displayIndex + index].style.backgroundColor =
        colors[nextRandomColor];
    });
  }

  // add functionality to the button

  startBtn.addEventListener("click", () => {
    if (timerId) {
      stop = true;
      clearInterval(timerId);
      timerId = null;
    } else {
      stop = false;
      draw();
      timerId = setInterval(moveDown, 1000 / 3);
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      nextRandomColor = Math.floor(Math.random() * colors.length);
      displayShape();
    }
  });

  // add score

  function addScore() {
    for (let i = 0; i < 11*20; i += width) {
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
        i + 10,
      ];
      if (row.every((index) => square[index].classList.contains("taken"))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach((index) => {
          square[index].classList.remove("taken");
          square[index].classList.remove("tetromino");
        });

        const squareRemoved = square.splice(i, width);
        squareRemoved.forEach(
          (Element) => (Element.style.backgroundColor = "")
        );
        console.log(squareRemoved);

        square = squareRemoved.concat(square);
        square.forEach((cell) => {
          grid.appendChild(cell);
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
      window.alert("game over");
      scoreDisplay.innerHTML = "end";
      clearInterval(timerId);
    }
  }
});
