// Constants for board and game elements
const tileSize = 32;
const rows = 16;
const columns = 16;

const board = document.getElementById("board");
const context = board.getContext("2d");

const shipWidth = tileSize * 2;
const shipHeight = tileSize;
const shipVelocityX = tileSize;

// Image paths
const shipImgPath = "/Space Game/spaceship[.jpg"; // Replace with the actual path to your ship image
const alienImgPath = "/Space Game/rock.jpg"; // Replace with the actual path to your alien image
const backgroundImgPath = "/Space Game/space.jpg"; // Replace with the path to your background image

// Game state variables
let ship = {
    x: tileSize * columns / 2 - tileSize,
    y: tileSize * rows - tileSize * 2,
    width: shipWidth,
    height: shipHeight,
};

let shipImg = new Image();
shipImg.src = shipImgPath;

let alienArray = [];
let alienWidth = tileSize * 2;
let alienHeight = tileSize;

// Load alien image
let alienImg = new Image();
alienImg.src = alienImgPath;

const alienX = tileSize;
const alienY = tileSize;
const alienRows = 2;
const alienColumns = 3;
const alienVelocityY = 1; // Change to vertical movement

const bulletVelocityY = -10;

// Game state variables
let bulletArray = [];
let score = 0;
let gameOver = false;

// Load background image
let backgroundImg = new Image();
backgroundImg.src = backgroundImgPath;

let gameInitialized = false; // Variable to track if the game has been initialized

// Event listeners
const startButton = document.getElementById("startButton");
const footer = document.querySelector("footer");

startButton.addEventListener("click", startNewGame);

function startNewGame() {
    // Show the game container
    const container = document.querySelector(".container");
    container.style.display = "block";
    // Hide the footer
    footer.style.display = "none";
    if (!gameInitialized) {
        // Initialize the game if it hasn't been initialized yet
        gameInitialized = true;
        board.width = tileSize * columns;
        board.height = tileSize * rows;
        requestAnimationFrame(update);
        document.addEventListener("keydown", moveShip);
        document.addEventListener("keyup", shoot);
    }
    else{
        // Clear the canvas to start a new game
        context.clearRect(0, 0, board.width, board.height);

        
    }

    // Clear previous game state
    score = 0;
    gameOver = false;
    bulletArray = [];
    alienArray = [];

    // Reset ship position
    ship.x = tileSize * columns / 2 - tileSize;
    ship.y = tileSize * rows - tileSize * 2;

    // Create new aliens
    createAliens();
}

function update() {
    requestAnimationFrame(update);

    if (gameOver || score >= 600) {
        context.drawImage(backgroundImg, 0, 0, board.width, board.height); // Display background
        context.fillStyle = "white";
        context.font = "32px courier";

        if (score >= 600) {
            context.fillText("YOU WIN!", board.width / 2 - 60, board.height / 2);
        } else {
            context.fillText("Game Over", board.width / 2 - 80, board.height / 2);
        }

        context.fillText("Score: " + score, board.width / 2 - 40, board.height / 2 + 40);

        return;
    }

    context.drawImage(backgroundImg, 0, 0, board.width, board.height); // Display background

    // Ship
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

    // Alien
    for (let i = 0; i < alienArray.length; i++) {
        let alien = alienArray[i];
        if (alien.alive) {
            alien.y += alienVelocityY; // Move aliens vertically down
            if (alien.y >= ship.y) {
                gameOver = true;
                context.fillStyle = "white";
                context.font = "32px courier";
                context.fillText("Game Over", board.width / 2 - 80, board.height / 2);
            }
            context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);
        }
    }

    // Bullets
    for (let i = 0; i < bulletArray.length; i++) {
        let bullet = bulletArray[i];
        bullet.y += bulletVelocityY;
        context.fillStyle = "black";
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        for (let j = 0; j < alienArray.length; j++) {
            let alien = alienArray[j];
            if (!bullet.used && alien.alive && detectCollision(bullet, alien)) {
                bullet.used = true;
                alien.alive = false;
                score += 100;
            }
        }
    }

    bulletArray = bulletArray.filter((bullet) => !bullet.used);

    // Score
    context.fillStyle = "white";
    context.font = "16px courier";
    context.fillText(score, 5, 20);
}

function moveShip(e) {
    if (gameOver) {
        return;
    }

    if (e.key === "ArrowLeft" && ship.x - shipVelocityX >= 0) {
        ship.x -= shipVelocityX;
    } else if (e.key === "ArrowRight" && ship.x + shipVelocityX + ship.width <= board.width) {
        ship.x += shipVelocityX;
    }
}

function createAliens() {
    for (let c = 0; c < alienColumns; c++) {
        for (let r = 0; r < alienRows; r++) {
            let alien = {
                x: alienX + c * alienWidth,
                y: alienY + r * alienHeight,
                width: alienWidth,
                height: alienHeight,
                alive: true,
            };
            alienArray.push(alien);
        }
    }
}

function shoot(e) {
    if (gameOver) {
        return;
    }

    if (e.key === " ") {
        let bullet = {
            x: ship.x + (shipWidth * 15) / 32,
            y: ship.y,
            width: tileSize / 8,
            height: tileSize / 2,
            used: false,
        };
        bulletArray.push(bullet);
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}
