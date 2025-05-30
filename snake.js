const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const grid = 20;
let count = 0;
let snake = { x: 160, y: 160, dx: grid, dy: 0, cells: [], maxCells: 4 };
let apple = { x: 320, y: 320 };
let score = 0;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function resetGame() {
    snake.x = 160;
    snake.y = 160;
    snake.dx = grid;
    snake.dy = 0;
    snake.cells = [];
    snake.maxCells = 4;
    apple.x = getRandomInt(0, 20) * grid;
    apple.y = getRandomInt(0, 20) * grid;
    score = 0;
}

function gameLoop() {
    requestAnimationFrame(gameLoop);
    if (++count < 4) return;
    count = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snake.x += snake.dx;
    snake.y += snake.dy;

    if (snake.x < 0) snake.x = canvas.width - grid;
    else if (snake.x >= canvas.width) snake.x = 0;
    if (snake.y < 0) snake.y = canvas.height - grid;
    else if (snake.y >= canvas.height) snake.y = 0;

    snake.cells.unshift({ x: snake.x, y: snake.y });
    if (snake.cells.length > snake.maxCells) snake.cells.pop();

    // 사과를 원형으로 빨간색으로 그림
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(apple.x + grid/2 - 1, apple.y + grid/2 - 1, (grid-2)/2, 0, Math.PI * 2);
    ctx.fill();

    // 뱀을 원형으로 보라색으로 그림
    ctx.fillStyle = 'purple';
    snake.cells.forEach((cell, index) => {
        ctx.beginPath();
        ctx.arc(cell.x + grid/2 - 1, cell.y + grid/2 - 1, (grid-2)/2, 0, Math.PI * 2);
        ctx.fill();
        // 머리에 눈 추가
        if (index === 0) {
            ctx.fillStyle = '#fff';
            // 왼쪽 눈
            ctx.beginPath();
            ctx.arc(cell.x + grid/2 - 5, cell.y + grid/2 - 3, 2, 0, Math.PI * 2);
            ctx.fill();
            // 오른쪽 눈
            ctx.beginPath();
            ctx.arc(cell.x + grid/2 + 5, cell.y + grid/2 - 3, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'purple';
        }
        if (cell.x === apple.x && cell.y === apple.y) {
            snake.maxCells++;
            score++;
            apple.x = getRandomInt(0, 20) * grid;
            apple.y = getRandomInt(0, 20) * grid;
        }
        for (let i = index + 1; i < snake.cells.length; i++) {
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                resetGame();
            }
        }
    });

    ctx.fillStyle = '#222';
    ctx.font = '18px Arial';
    ctx.fillText('Score: ' + score, 10, 390);
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft' && snake.dx === 0) {
        snake.dx = -grid; snake.dy = 0;
    } else if (e.key === 'ArrowUp' && snake.dy === 0) {
        snake.dy = -grid; snake.dx = 0;
    } else if (e.key === 'ArrowRight' && snake.dx === 0) {
        snake.dx = grid; snake.dy = 0;
    } else if (e.key === 'ArrowDown' && snake.dy === 0) {
        snake.dy = grid; snake.dx = 0;
    }
});

resetGame();
gameLoop();