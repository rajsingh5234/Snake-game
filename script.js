document.addEventListener("DOMContentLoaded", () => {

    let gameArena;
    let intervalId;
    let gameStarted = false;
    let score = 0;
    let gameSpeed = 200;
    const totalRows = 30;
    const totalCols = 30;
    const cellsize = 20;
    const gameArenaWidth = totalRows * cellsize;
    const gameArenaHeight = totalCols * cellsize;

    const intitalTop = Math.floor(gameArenaHeight / 3);
    const inititalLeft = Math.floor(gameArenaWidth / 5);

    let food = { x: Math.floor(gameArenaWidth / 2), y: intitalTop };
    let snake = [{ x: inititalLeft, y: intitalTop }, { x: inititalLeft + cellsize, y: intitalTop }, { x: inititalLeft + (2 * cellsize), y: intitalTop }] // tail body head

    let dx = cellsize;
    let dy = 0;

    function createDiv(x, y, className) {
        const div = document.createElement("div");
        div.style.width = `${cellsize}px`;
        div.style.height = `${cellsize}px`;
        div.style.left = `${x}px`;
        div.style.top = `${y}px`;
        div.classList.add(className);
        return div;
    }


    function drawSnakeAndFood() {
        gameArena.innerHTML = "";

        const newFood = createDiv(food.x, food.y, "food");
        gameArena.appendChild(newFood);

        snake.forEach((snakeCell, i) => {
            const snakeBody = createDiv(snakeCell.x, snakeCell.y, "snake");
            if (i === snake.length - 1) snakeBody.classList.add("snake-head")
            gameArena.appendChild(snakeBody);
        })
    }

    function moveFood() {

        let newX;
        let newY;

        do {
            newX = Math.floor(Math.random() * (totalRows - 1)) * cellsize;
            newY = Math.floor(Math.random() * (totalCols - 1)) * cellsize;
        }
        while (snake.some((snakeCell) => snakeCell.x === newX && snakeCell.y === newY));

        food = { x: newX, y: newY };
    }

    function updateScore(value) {
        score += value;
        const scoreboard = document.getElementById("score-board");
        scoreboard.textContent = score;
    }

    function increaseGameSpeed() {
        if (gameSpeed > 50) {
            gameSpeed -= 10;
        }

        clearInterval(intervalId);
        gameLoop();
    }

    function moveSnake() {
        const head = snake[snake.length - 1];
        const newHead = { x: head.x + dx, y: head.y + dy };

        snake.push(newHead);

        if (newHead.x === food.x && newHead.y === food.y) {
            // move food
            updateScore(10);
            moveFood();
            increaseGameSpeed();
        }
        else {
            // remove last element of snake body, means remove first element of snake array
            snake.shift();
        }
    }

    function changeDirection(event) {

        const key = event.key;

        const up = key === "ArrowUp" || key === "w";
        const down = key === "ArrowDown" || key === "s";
        const left = key === "ArrowLeft" || key === "a";
        const right = key === "ArrowRight" || key === "d";

        const goingUp = dy === -cellsize;
        const goingDown = dy === cellsize;
        const goingLeft = dx === -cellsize;
        const goingRight = dx === cellsize;

        if (up && !goingUp && !goingDown) {
            dy = -cellsize;
            dx = 0;
        }
        else if (down && !goingDown && !goingUp) {
            dy = cellsize;
            dx = 0;
        }
        else if (left && !goingLeft && !goingRight) {
            dx = -cellsize;
            dy = 0;
        }
        else if (right && !goingRight && !goingLeft) {
            dx = cellsize;
            dy = 0;
        }
    }

    function isGameOver() {
        const head = snake[snake.length - 1];

        // check collision with walls
        const rightWall = head.x > gameArenaWidth - cellsize;
        const leftWall = head.x < 0;
        const topWall = head.y < 0;
        const bottomWall = head.y > gameArenaHeight - cellsize;

        if (rightWall || leftWall || topWall || bottomWall) return true;


        // check collision with snake body
        for (let i = 0; i < snake.length - 1; i++) {
            const snakeCell = snake[i];

            if (snakeCell.x === head.x && snakeCell.y === head.y) return true;
        }

        return false;
    }

    function gameLoop() {
        intervalId = setInterval(() => {
            if (isGameOver()) {
                gameStarted = false;
                alert("Game Over" + "\n" + "Score is: " + score);
                clearInterval(intervalId);
            }
            moveSnake();
            drawSnakeAndFood();
        }, gameSpeed);
    }

    function runGame() {
        if (gameStarted) return;
        gameStarted = true;
        document.addEventListener("keydown", changeDirection);
        document.getElementById("start-game").classList.add("hide");
        gameLoop();
    }


    function initializeGame() {
        gameArena = document.getElementById("game-arena");
        gameArena.classList.add("game-arena");
        gameArena.style.width = `${gameArenaWidth}px`;
        gameArena.style.height = `${gameArenaHeight}px`

        const scoreboard = document.createElement("div");
        scoreboard.classList.add("score-board");
        scoreboard.setAttribute("id", "score-board");
        scoreboard.textContent = score;

        const startGame = document.createElement("div");
        startGame.classList.add("start-game");
        startGame.setAttribute("id", "start-game");

        const startBtn = document.createElement("button");
        startBtn.classList.add("start-btn");
        startBtn.textContent = "Start game";
        startBtn.addEventListener("click", runGame);

        startGame.appendChild(startBtn);

        document.body.insertBefore(scoreboard, gameArena);
        document.body.appendChild(startGame);
    }

    initializeGame();

})