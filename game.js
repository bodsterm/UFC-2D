const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Player objects
const player1 = {
    x: 100,
    y: 300,
    width: 50,
    height: 100,
    speed: 5,
    dy: 0,
    jumping: false,
    health: 100,
    punching: false,
    punchTimer: 0
};

const player2 = {
    x: 650,
    y: 300,
    width: 50,
    height: 100,
    speed: 5,
    dy: 0,
    jumping: false,
    health: 100,
    punching: false,
    punchTimer: 0
};

// Game variables
const gravity = 0.5;
const jumpPower = -10;
const groundY = 300;
const punchDuration = 10;
const punchCooldown = 20;
let gameOver = false;
let winner = null;

// Keyboard controls
const keys = {
    w: false,
    a: false,
    d: false,
    e: false,
    ArrowUp: false,
    ArrowLeft: false,
    ArrowRight: false,
    l: false
};

document.addEventListener('keydown', (e) => {
    if (e.key in keys) keys[e.key] = true;
    // Prevent jump spamming
    if (e.key === 'w' && player1.y === groundY && !player1.jumping) {
        player1.dy = jumpPower;
        player1.jumping = true;
    }
    if (e.key === 'ArrowUp' && player2.y === groundY && !player2.jumping) {
        player2.dy = jumpPower;
        player2.jumping = true;
    }
    // Punch controls
    if (e.key === 'e' && !player1.punching && player1.punchTimer <= 0) {
        player1.punching = true;
        player1.punchTimer = punchCooldown;
    }
    if (e.key === 'l' && !player2.punching && player2.punchTimer <= 0) {
        player2.punching = true;
        player2.punchTimer = punchCooldown;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key in keys) keys[e.key] = false;
});

// Collision detection
function isColliding(playerA, playerB) {
    return playerA.x < playerB.x + playerB.width &&
           playerA.x + playerA.width > playerB.x &&
           playerA.y < playerB.y + playerB.height &&
           playerA.y + playerA.height > playerB.y;
}

// Update game state
function update() {
    if (gameOver) return;

    // Player 1 movement
    if (keys.a && player1.x > 0) player1.x -= player1.speed;
    if (keys.d && player1.x < canvas.width - player1.width) player1.x += player1.speed;

    // Player 2 movement
    if (keys.ArrowLeft && player2.x > 0) player2.x -= player2.speed;
    if (keys.ArrowRight && player2.x < canvas.width - player2.width) player2.x += player2.speed;

    // Apply gravity
    player1.y += player1.dy;
    player2.y += player2.dy;
    player1.dy += gravity;
    player2.dy += gravity;

    // Ground collision
    if (player1.y > groundY) {
        player1.y = groundY;
        player1.dy = 0;
        player1.jumping = false;
    }
    if (player2.y > groundY) {
        player2.y = groundY;
        player2.dy = 0;
        player2.jumping = false;
    }

    // Punch mechanics
    if (player1.punching) {
        if (isColliding(player1, player2)) {
            player2.health -= 10;
        }
        player1.punchTimer--;
        if (player1.punchTimer <= punchDuration) player1.punching = false;
    }
    if (player2.punching) {
        if (isColliding(player2, player1)) {
            player1.health -= 10;
        }
        player2.punchTimer--;
        if (player2.punchTimer <= punchDuration) player2.punching = false;
    }

    // Cooldown for punches
    if (player1.punchTimer > 0) player1.punchTimer--;
    if (player2.punchTimer > 0) player2.punchTimer--;

    // Check for knockout
    if (player1.health <= 0) {
        gameOver = true;
        winner = 'Player 2';
    } else if (player2.health <= 0) {
        gameOver = true;
        winner = 'Player 1';
    }
}

// Render game
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw players
    ctx.fillStyle = 'red';
    ctx.fillRect(player1.x, player1.y, player1.width, player1.height);
    ctx.fillStyle = 'blue';
    ctx.fillRect(player2.x, player2.y, player2.width, player2.height);

    // Draw punch effect
    if (player1.punching) {
        ctx.fillStyle = 'orange';
        ctx.fillRect(player1.x + player1.width, player1.y, 20, 20);
    }
    if (player2.punching) {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(player2.x - 20, player2.y, 20, 20);
    }

    // Draw health bars
    ctx.fillStyle = 'green';
    ctx.fillRect(10, 10, player1.health * 2, 20);
    ctx.fillRect(canvas.width - 210, 10, player2.health * 2, 20);
    ctx.fillStyle = 'black';
    ctx.fillText('Player 1', 10, 40);
    ctx.fillText('Player 2', canvas.width - 210, 40);

    // Draw game over message
    if (gameOver) {
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText(`Game Over! ${winner} Wins!`, canvas.width / 2 - 100, canvas.height / 2);
    }
}

// Game loop
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

gameLoop();
