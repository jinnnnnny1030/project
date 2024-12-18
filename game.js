const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 5;
let dy = -5;
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let score = 0;
let lives = 3;

const BRICK_WIDTH = brickWidth;
const BRICK_HEIGHT = brickHeight;
const BRICK_PADDING = brickPadding;
const BRICK_OFFSET_TOP = brickOffsetTop;
const BRICK_OFFSET_LEFT = brickOffsetLeft;
const PADDLE_HEIGHT = paddleHeight;
const PADDLE_WIDTH = paddleWidth;
const BALL_RADIUS = ballRadius;
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const PADDLE_SPEED = 7; // 이동 속도 7픽셀

const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// 모바일 버튼 이벤트 리스너 추가 (터치 이벤트)
let moveInterval;
document.getElementById("leftBtn").addEventListener("touchstart", () => {
    leftPressed = true;
    if (!moveInterval) {
        moveInterval = setInterval(() => {
            if (leftPressed && paddleX > 0) {
                paddleX -= PADDLE_SPEED;
            }
        }, 100); // 100ms 간격으로 패들 이동
    }
});

document.getElementById("leftBtn").addEventListener("touchend", () => {
    leftPressed = false;
    clearInterval(moveInterval); // 이동 멈추기
    moveInterval = null;
});

document.getElementById("rightBtn").addEventListener("touchstart", () => {
    rightPressed = true;
    if (!moveInterval) {
        moveInterval = setInterval(() => {
            if (rightPressed && paddleX < canvas.width - paddleWidth) {
                paddleX += PADDLE_SPEED;
            }
        }, 100); // 100ms 간격으로 패들 이동
    }
});

document.getElementById("rightBtn").addEventListener("touchend", () => {
    rightPressed = false;
    clearInterval(moveInterval); // 이동 멈추기
    moveInterval = null;
});

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (
                    x > b.x &&
                    x < b.x + brickWidth &&
                    y > b.y &&
                    y < b.y + brickHeight
                ) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score === brickRowCount * brickColumnCount) {
                        alert("YOU WIN, CONGRATS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            lives--;
            if (!lives) {
                alert("GAME OVER");
                document.location.reload();
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 5;
                dy = -5;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    // 키보드 입력으로 패들 이동
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += PADDLE_SPEED;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= PADDLE_SPEED;
    }

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

draw();



