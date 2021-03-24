// TODO: add pause function
// TODO: add hiscore
// TODO: add local storage for hiscore
// TODO: difficulty levels?
// TODO: tweak socring system
// TODO: don't stop game if you press opposite direction to snakes current heading

// for setting the game up
const grid = document.querySelector('.grid')
const startButton = document.getElementById('start')
const resetButton = document.getElementById('reset')
const scoreDisplay = document.getElementById('score')
const squares = []
const width = 20
const height = 15

// game state variables
let currentSnake = [2, 1, 0]
let direction = 1
let appleIndex = 0
let score = 0
let intervalTime = 500
const speed = 0.9
let timerId = 0
let isPaused = true

// event listeners
document.addEventListener('keyup', control)
startButton.addEventListener('click', startGame)
resetButton.addEventListener('click', resetGame)

function createGrid () {
  // create 300 square for our 20x15 grid
  for (let i = 0; i < width * height; i++) {
    const square = document.createElement('div')
    square.classList.add('square')
    grid.appendChild(square)
    squares.push(square)
  }
}

createGrid()
// createSnake()
// generateApple()

function createSnake () {
  currentSnake.forEach(index => squares[index].classList.add('snake'))
}

function startGame () {
  generateApple()
  createSnake()
  timerId = setInterval(move, intervalTime)
}

function move () {
  if (
    (currentSnake[0] + width >= width * width && direction === width) || // if snake has hit bottom
    (currentSnake[0] % width === width - 1 && direction === 1) || // if snake has hit right wall
    (currentSnake[0] % width === 0 && direction === -1) || // if snake has hit left wall
    (currentSnake[0] - width < 0 && direction === -width) || // if snake has hit top
    squares[currentSnake[0] + direction].classList.contains('snake')
  ) {
    return clearInterval(timerId)
  }

  // remove last element from our currentSnake array
  const tail = currentSnake.pop()
  // remove styling from last element
  squares[tail].classList.remove('snake')
  // add square in direction we are heading
  currentSnake.unshift(currentSnake[0] + direction)
  // add styling so we can see it

  // deal with snake head gets apple
  if (squares[currentSnake[0]].classList.contains('apple')) {
    // remove the class of apple
    squares[currentSnake[0]].classList.remove('apple')
    // grow our snake by adding class of snake to it
    squares[tail].classList.add('snake')
    console.log(tail)
    // grow our snake array
    currentSnake.push(tail)
    console.log(currentSnake)
    // generate new apple
    generateApple()
    // add one to the score
    score++
    // display our score
    scoreDisplay.textContent = score
    // speed up our snake
    clearInterval(timerId)
    console.log(intervalTime)
    intervalTime = intervalTime * speed
    console.log(intervalTime)
    timerId = setInterval(move, intervalTime)
  }

  squares[currentSnake[0]].classList.add('snake')
}

function generateApple () {
  do {
    appleIndex = Math.floor(Math.random() * squares.length)
  } while (squares[appleIndex].classList.contains('snake'))
  squares[appleIndex].classList.add('apple')
}

function resetGame () {
  console.log('reset')
  // remove the snake
  currentSnake.forEach(index => squares[index].classList.remove('snake'))
  // remove the apple
  squares[appleIndex].classList.remove('apple')
  clearInterval(timerId)
  currentSnake = [2, 1, 0]
  score = 0
  scoreDisplay.textContent = score
  direction = 1
  intervalTime = 1000
  isPaused = !isPaused
}

// 39 is right arrow
// 38 is for the up arrow
// 37 is for the left arrow
// 40 is for the down arrow

function control (e) {
  if (e.keyCode === 39) {
    console.log('right pressed')
    direction = 1
  } else if (e.keyCode === 38) {
    console.log('up pressed')
    direction = -width
  } else if (e.keyCode === 37) {
    console.log('left pressed')
    direction = -1
  } else if (e.keyCode === 40) {
    console.log('down pressed')
    direction = +width
  }
}
