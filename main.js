$(document).ready(function () {
    const canvas = document.getElementById('gameCanvas')
    const ctx = canvas.getContext('2d')
    const ballRadius = 10

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

    const brickRowCount = 3
    const brickColumnCount = 5
    const brickWidth = 75
    const brickHeight = 20
    const brickPadding = 10
    const brickOffsetTop = 30
    const brickOffsetLeft = 30

    let score = 0
    let lives = 3

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
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        drawBall()
        drawPaddle()
        drawBricks()
        collisionDetection()
        drawScore()
        drawLives()
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
                if (y + distY > canvas.height - ballRadius) {
                    lives--
                    if (!lives) {
                        alert("CRASHED! GAME OVER")
                        document.location.reload()
                        clearInterval(interval)
                    } else {
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

    //paddle controls
    $(document).keydown(function (e) {
        if (e.keyCode == 39) {
            rightPressed = true
        } else if (e.keyCode == 37) {
            leftPressed = true
        }
    })
    $(document).keyup(function (e) {
        if (e.keyCode == 39) {
            rightPressed = false
        } else if (e.keyCode == 37) {
            leftPressed = false
        }
    })
    function startGame() {
        if (!gameStart) {
            gameStart = true
            $('#start').hide()
            interval = setInterval(draw, 10)
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
        ctx.font = '16px Arial'
        ctx.fillStyle = '#0095DD'
        ctx.fillText('Score:' + score, 8, 20)
    }
    //lives
    function drawLives() {
        ctx.font = '16px Arial'
        ctx.fillStyle = '#0095DD'
        ctx.fillText('Lives:' + lives, canvas.width - 65, 20)
    }
})
