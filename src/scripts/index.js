// TODO: add local storage for hiscore
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
const squares = []
const width = 20
const height = 15
const playIcon = '<i class="fas fa-play"></i>'
const pauseIcon = '<i class="fas fa-pause"></i>'

// game state variables
let currentSnake = [2, 1, 0]
let direction = 1
let appleIndex = 0
let score = 0
let hiscore = 0
let intervalTime = 500
const speedMultiplier = 0.9
let timerId = 0
let isPaused = true
let isGameOver = true

// event listeners
document.addEventListener('keyup', handleKeyInput)
startButton.addEventListener('click', startGame)
resetButton.addEventListener('click', () => resetGame(false))
document.getElementById('up').addEventListener('click', handleDPad)
document.getElementById('left').addEventListener('click', handleDPad)
document.getElementById('right').addEventListener('click', handleDPad)
document.getElementById('down').addEventListener('click', handleDPad)

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
  const storedHiscore = localStorage.getItem('snakeHiscore')
  if (typeof storedHiscore !== 'string') return // should be a string
  const parsedHiscore = JSON.parse(storedHiscore) // convert back to JSON
  hiscore = parsedHiscore.hiscore
  hiscoreDisplay.textContent = hiscore
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
    timerId = setInterval(move, intervalTime)
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
    timerId = setInterval(move, intervalTime)
    isPaused = false
    startButton.innerHTML = pauseIcon
    pauseScreen.style.display = 'none'
  }
}

function move () {
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
  if (squares[currentSnake[0]].classList.contains('apple')) {
    // remove the class of apple
    squares[currentSnake[0]].classList.remove('apple')
    // grow our snake by adding class of snake to it
    squares[tail].classList.add('snake')
    // console.log(tail)
    // grow our snake array
    currentSnake.push(tail)
    // console.log(currentSnake)
    // generate new apple
    generateApple()
    // add one to the score
    score++
    // display our score
    scoreDisplay.textContent = score
    // speed up our snake
    clearInterval(timerId)
    // console.log(intervalTime)
    intervalTime = intervalTime * speedMultiplier
    // console.log(intervalTime)
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

function resetGame (cameFromGameover) {
  clearInterval(timerId)
  currentSnake.forEach(index => squares[index].classList.remove('snake'))
  squares[appleIndex].classList.remove('apple')
  startButton.innerHTML = playIcon

  currentSnake = [2, 1, 0]
  score = 0
  scoreDisplay.textContent = score
  direction = 1
  intervalTime = 500
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
  }
}

function handleKeyInput (e) {
  let newDirection

  if (e.keyCode === 39) {
    // console.log('right pressed')
    newDirection = 1
  } else if (e.keyCode === 38) {
    // console.log('up pressed')
    newDirection = -width
  } else if (e.keyCode === 37) {
    // console.log('left pressed')
    newDirection = -1
  } else if (e.keyCode === 40) {
    // console.log('down pressed')
    newDirection = +width
  }

  changeDirection(newDirection)
}

function handleDPad (event) {
  let newDirection
  const input = event.currentTarget.id

  if (input === 'right') {
    // console.log('right pressed')
    newDirection = 1
  } else if (input === 'up') {
    // console.log('up pressed')
    newDirection = -width
  } else if (input === 'left') {
    // console.log('left pressed')
    newDirection = -1
  } else if (input === 'down') {
    // console.log('down pressed')
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
