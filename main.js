$(document).ready(function () {
    const canvas = document.getElementById('gameCanvas')
    const ctx = canvas.getContext('2d')
    const ballRadius = 10
    const boundingRect = document.getElementById('special').getBoundingClientRect()

    const leftconsole = document.getElementById('left-console').getBoundingClientRect()
    const rightconsole = document.getElementById('right-console').getBoundingClientRect()
    const scoreText = document.getElementById('scoreText')
    const livesText = document.getElementById('livesText')
    canvas.width = boundingRect.width
    canvas.height = boundingRect.height
    canvas.style.top = (boundingRect.height / 2 + boundingRect.top) + 'px'
    canvas.style.left = (boundingRect.width / 2 + boundingRect.left) + 'px'
    scoreText.style.top = (leftconsole.top + leftconsole.height / 4.5) + 'px'
    scoreText.style.left = (leftconsole.left + leftconsole.width / 4) + 'px'
    livesText.style.top = (rightconsole.top + rightconsole.height / 4.5) + 'px'
    livesText.style.left = (rightconsole.left + rightconsole.width / 3.5) + 'px'

    document.getElementById('gameTitle').style.left = '52%'

    const paddleHeight = 10
    const paddleWidth = 75
    let paddleX = (canvas.width - paddleWidth) / 2
    let paddleY = canvas.height - paddleHeight - 10
    let rightPressed = false
    let leftPressed = false

    let x = canvas.width / 2
    let y = canvas.height - 30
    let distX = 5
    let distY = -5

    let interval = 0
    let gameStart = false
    let isFlipped = false
    let lastFlipped = 0
    let minFlipTime = 10000

    const brickRowCount = 3
    const brickColumnCount = 5
    const brickWidth = 75
    const brickHeight = 20
    const brickPadding = 10
    let brickOffsetTop = canvas.height / 10
    const brickOffsetLeft = canvas.width / 2 - (brickColumnCount * (brickWidth + brickPadding)) / 2

    let score = 0
    let lives = 5

    let bricks = []
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = []
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 }
        }
    }
    //bricks
    function drawBricks() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status === 1) {
                    const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft
                    const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop
                    bricks[c][r].x = brickX
                    bricks[c][r].y = brickY
                    ctx.beginPath()
                    ctx.rect(brickX, brickY, brickWidth, brickHeight)
                    ctx.fillStyle = '#0095DD'
                    ctx.fill()
                    ctx.closePath()
                }
            }
        }
    }

    //ball
    function drawBall() {
        ctx.beginPath()
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
        ctx.fillStyle = '#0095DD'
        ctx.fill()
        ctx.closePath()
    }

    function drawPaddle() {
        ctx.beginPath()
        ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight)
        ctx.fillStyle = '#0095DD'
        ctx.fill()
        ctx.closePath()
    }

    function draw() {
        if (!gameStart) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            drawPaddle()
            drawBricks()
            drawStart()
        }
        else {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            drawBall()
            drawPaddle()
            drawBricks()
            collisionDetection()
            drawScore()
            drawLives()
            flipCalc()
            x += distX
            y += distY

            if (rightPressed) {
                if (paddleX < canvas.width - paddleWidth) {
                    paddleX += 7
                }
            } else if (leftPressed) {
                leftPressed = true
                if (paddleX > 0) {
                    paddleX -= 7
                }
            }
            if (x + distX > canvas.width - ballRadius || x < ballRadius) {
                distX = -distX
            }
            if (y < ballRadius)
                distY = -distY
            else if (y + distY + 10 > canvas.height - ballRadius) {
                if (x > paddleX && x < paddleX + paddleWidth)
                    distY = -distY
                else {
                    if (y + distY > canvas.height) {
                        lives--
                        if (!lives) {
                            alert("CRASHED! GAME OVER")
                            document.location.reload()
                            clearInterval(interval)
                        }
                        else {
                            x = canvas.width / 2
                            y = canvas.height - 30
                            distX = 5
                            distY = -5
                            paddleX = (canvas.width - paddleWidth) / 2
                        }
                    }
                }
            }
        }
    }

    //paddle controls
    $(document).keydown(function (e) {
        if (e.keyCode == 39) {
            rightPressed = true
            $('#right-button-up').hide()
        } else if (e.keyCode == 37) {
            leftPressed = true
            $('#left-button-up').hide()
        } else if (e.keyCode == 32) {
            startGame()
        }
    })
    $(document).keyup(function (e) {
        if (e.keyCode == 39) {
            rightPressed = false
            $('#right-button-up').show()
        } else if (e.keyCode == 37) {
            leftPressed = false
            $('#left-button-up').show()
        } 
    })
    function startGame() {
        if (!gameStart) {
            gameStart = true
        }
    }
    $('#start').on('click', startGame)

    //collision detection
    function collisionDetection() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                const b = bricks[c][r]
                if (b.status === 1) {
                    if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                        distY = -distY
                        b.status = 0
                        score++
                        if (score === brickRowCount * brickColumnCount) {
                            alert('You Win! Congratulations!')
                            document.location.reload()
                            clearInterval(interval)
                        }
                    }
                }
            }

        }
    }
 //score
    function drawScore() {
        $('#scoreText').html("Score: <br>")
        $('#scoreText').append(score)
    }
    //lives
    function drawLives() {
        $('#livesText').html("Lives: <br>")
        $('#livesText').append(lives)
    }
    //draw press space to start
    function drawStart() {
        ctx.font = "38px Handjet"
        ctx.fillStyle = "#0095DD"
        ctx.fillText("Press Space to Start", canvas.width / 2-140, canvas.height / 2)
    }

    function flip() {
        // $('#gameCanvas').css('transform-origin', '0 0')
        if (!isFlipped) {
            $('#gameCanvas').css('transform', 'rotate(180deg)')
            canvas.style.top = (boundingRect.top) + 'px'
            canvas.style.left = (boundingRect.left) + 'px'
            isFlipped = true
        } else {
            $('#gameCanvas').css('transform', 'rotate(0deg)')
            canvas.style.top = (boundingRect.top) + 'px'
            canvas.style.left = (boundingRect.left) + 'px'
            isFlipped = false
        }
    }
    function flipCalc() {
        let number = Math.floor(Math.random() * 1000)
        if (number < 10 && performance.now() - lastFlipped > minFlipTime) {
            shake()
            lastFlipped = performance.now()
            setTimeout(flip, 1100)
        }

    }
    interval = setInterval(draw, 10)

    function shake(){
        $('#gameCanvas').effect('shake', { times: 8, distance: 10 }, 1000)
    }
    $(window).on('resize', function () {
    document.location.reload()
    })
})