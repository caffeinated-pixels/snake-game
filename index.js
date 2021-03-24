// add sounds?
// TODO: difficulty levels?
// TODO: tweak socring system

// for setting the game up
const grid = document.querySelector('.grid')
const startButton = document.getElementById('start')
const resetButton = document.getElementById('reset')
const scoreDisplay = document.getElementById('score')
const hiscoreDisplay = document.getElementById('hiscore')
const startScreen = document.getElementById('start-screen')
const pauseScreen = document.getElementById('pause-screen')
const gameoverScreen = document.getElementById('gameover-screen')
const gameoverScore = document.getElementById('gameover-score')
const gulp = document.getElementById('gulp')
const squares = []
const width = 20
const height = 15
const playIcon = '<i class="fas fa-play"></i>'
const pauseIcon = '<i class="fas fa-pause"></i>'
// const appleIcon = '<i class="fas fa-apple-alt"></i>'

// game state variables
const speedMultiplier = 0.9
const initialIntervalTime = 200

let currentSnake = [2, 1, 0]
let direction = 1
let appleIndex = 0
let score = 0
let hiscore = 0
let intervalTime = initialIntervalTime
let timerId = 0
let isPaused = true
let isGameOver = true

// event listeners
document.addEventListener('keydown', handleKeyInput)
startButton.addEventListener('click', startGame)
resetButton.addEventListener('click', () => resetGame(false))

document
  .querySelectorAll('.d-btn')
  .forEach(item => item.addEventListener('click', handleKeyInput))

function createGrid () {
  // create 300 square for our 20x15 grid
  for (let i = 0; i < width * height; i++) {
    const square = document.createElement('div')
    square.classList.add('square')
    grid.appendChild(square)
    squares.push(square)
  }
}

function getHiscoreFromStorage () {
  if (localStorage.snakeHiscore) {
    hiscore = localStorage.snakeHiscore
    hiscoreDisplay.textContent = hiscore
  }
}

getHiscoreFromStorage()
createGrid()

function createSnake () {
  currentSnake.forEach(index => squares[index].classList.add('snake'))
}

function startGame () {
  if (isGameOver) {
    generateApple()
    createSnake()
    timerId = setInterval(moveSnake, intervalTime)
    isGameOver = false
    isPaused = false
    startButton.innerHTML = pauseIcon
    startScreen.style.display = 'none'
    gameoverScreen.style.display = 'none'
    pauseScreen.style.display = 'none'
  } else if (!isPaused) {
    clearInterval(timerId)
    isPaused = true
    startButton.innerHTML = playIcon
    pauseScreen.style.display = 'block'
  } else {
    timerId = setInterval(moveSnake, intervalTime)
    isPaused = false
    startButton.innerHTML = pauseIcon
    pauseScreen.style.display = 'none'
  }
}

function moveSnake () {
  if (
    (currentSnake[0] + width >= width * height && direction === width) || // if snake has hit bottom
    (currentSnake[0] % width === width - 1 && direction === 1) || // if snake has hit right wall
    (currentSnake[0] % width === 0 && direction === -1) || // if snake has hit left wall
    (currentSnake[0] - width < 0 && direction === -width) || // if snake has hit top
    squares[currentSnake[0] + direction].classList.contains('snake')
  ) {
    return gameover()
  }

  // remove last element from our currentSnake array
  const tail = currentSnake.pop()
  // remove styling from last element
  squares[tail].classList.remove('snake')
  // add square in direction we are heading
  currentSnake.unshift(currentSnake[0] + direction)
  // add styling so we can see it

  // deal with snake head gets apple
  checkForApple(tail)

  squares[currentSnake[0]].classList.add('snake')
}

function checkForApple (tail) {
  if (squares[currentSnake[0]].classList.contains('apple')) {
    squares[currentSnake[0]].classList.remove('apple')
    gulp.play()
    // grow the snake
    squares[tail].classList.add('snake')
    currentSnake.push(tail)

    generateApple()

    score++
    scoreDisplay.textContent = score

    // speed up the snake
    clearInterval(timerId)
    intervalTime = intervalTime * speedMultiplier
    timerId = setInterval(moveSnake, intervalTime)
  }
}

function generateApple () {
  do {
    appleIndex = Math.floor(Math.random() * squares.length)
  } while (squares[appleIndex].classList.contains('snake'))
  squares[appleIndex].classList.add('apple')
  // squares[appleIndex].innerHTML = appleIcon
}

function resetGame (cameFromGameover) {
  clearInterval(timerId)
  currentSnake.forEach(index => squares[index].classList.remove('snake'))
  squares[appleIndex].classList.remove('apple')
  startButton.innerHTML = playIcon

  currentSnake = [2, 1, 0]
  score = 0
  scoreDisplay.textContent = score
  direction = 1
  intervalTime = initialIntervalTime
  isPaused = true

  if (!cameFromGameover) {
    isGameOver = true
    startScreen.style.display = 'block'
    pauseScreen.style.display = 'none'
    gameoverScreen.style.display = 'none'
  }
}

function gameover () {
  gameoverScore.textContent = score
  gameoverScreen.style.display = 'block'
  isGameOver = true
  setHiscore()
  resetGame(true)
}

function setHiscore () {
  if (score > hiscore) {
    hiscore = score
    hiscoreDisplay.textContent = hiscore
    localStorage.setItem('snakeHiscore', JSON.stringify({ hiscore: hiscore }))
    localStorage.setItem('snakeHiscore', hiscore)
  }
}

// TODO: merge handleKeyInput & handleDPad?
function handleKeyInput (event) {
  if (isPaused) return
  const input =
    event.type === 'keydown' ? event.keyCode : event.currentTarget.id
  let newDirection

  if (input === 39 || input === 'right') {
    newDirection = 1
  } else if (input === 38 || input === 'up') {
    newDirection = -width
  } else if (input === 37 || input === 'left') {
    newDirection = -1
  } else if (input === 40 || input === 'down') {
    newDirection = +width
  }

  changeDirection(newDirection)
}

function changeDirection (newDirection) {
  // so that snake head can only move forward
  if (direction !== -newDirection) {
    direction = newDirection
  }
}
