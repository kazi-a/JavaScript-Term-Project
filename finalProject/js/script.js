document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const player = {
        x: canvas.width / 2,
        y: canvas.height - 50,
        width: 50,
        height: 50,
        speed: 5,
        health: 3,
        score: 0
    };
    const bullets = [];
    const enemies = [];
    let gameOver = false;
    let rightPressed = false;
    let leftPressed = false;

    const spaceshipImage = new Image();
    spaceshipImage.src = 'media/spaceship.png';

    const shootSound = new Audio('media/shoot.mp3');
    const gameOverSound = new Audio('media/gameover.mp3');

    const levels = [
        { scoreThreshold: 0, enemySpeed: 2 },
        { scoreThreshold: 200, enemySpeed: 5 },
        { scoreThreshold: 500, enemySpeed: 7 }
    ];

    let currentLevelIndex = 0;

    // Function to update enemy speed based on current level
    function updateEnemySpeed() {
        const currentLevel = levels[currentLevelIndex];
        for (let enemy of enemies) {
            enemy.speed = currentLevel.enemySpeed;
        }
    }

    // Function to check if player should level up based on score
    function checkLevelUp() {
        const currentLevel = levels[currentLevelIndex];
        if (player.score >= currentLevel.scoreThreshold && currentLevelIndex < levels.length - 1) {
            currentLevelIndex++;
            updateEnemySpeed();
        }
    }

    // Event listeners for key presses
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') {
            rightPressed = true;
        } else if (event.key === 'ArrowLeft') {
            leftPressed = true;
        } else if (event.key === ' ' && !gameOver) {
            shoot();
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.key === 'ArrowRight') {
            rightPressed = false;
        } else if (event.key === 'ArrowLeft') {
            leftPressed = false;
        }
    });

    // Start button event listener
    document.getElementById('startButton').addEventListener('click', () => {
        document.getElementById('instructions').style.display = 'none';
        gameLoop();
    });

    // Function to draw the player's spaceship
    function drawPlayer() {
        ctx.drawImage(spaceshipImage, player.x, player.y, player.width, player.height);
    }

    // Function to draw enemies
    function drawEnemies() {
        for (let enemy of enemies) {
            ctx.fillStyle = enemy.color;
            if (enemy.shape === 'rectangle') {
                ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            } else if (enemy.shape === 'circle') {
                ctx.beginPath();
                ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, Math.min(enemy.width, enemy.height) / 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    // Function to draw bullets
    function drawBullets() {
        for (let bullet of bullets) {
            ctx.fillStyle = '#fff';
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        }
    }

    // Function to update player position based on key presses
    function updatePlayerPosition() {
        if (rightPressed && player.x < canvas.width - player.width) {
            player.x += player.speed;
        } else if (leftPressed && player.x > 0) {
            player.x -= player.speed;
        }
    }

    // Function to create a new enemy
    function createEnemy() {
        const enemy = {
            x: Math.random() * (canvas.width - 50),
            y: -50,
            speed: Math.random() * 2 + 1,
            shape: Math.random() < 0.5 ? 'rectangle' : 'circle',
            width: Math.random() * 50 + 20,
            height: Math.random() * 50 + 20,
            color: '#' + Math.floor(Math.random() * 16777215).toString(16)
        };

        enemies.push(enemy);
    }

    // Function to create a bullet
    function shoot() {
        const bullet = {
            x: player.x + player.width / 2 - 2.5,
            y: player.y,
            width: 5,
            height: 10,
            speed: 7
        };
        bullets.push(bullet);
        playShootSound();
    }

    // Function to update bullets' position
    function updateBulletsPosition() {
        for (let bullet of bullets) {
            bullet.y -= bullet.speed;
            if (bullet.y < 0) {
                bullets.splice(bullets.indexOf(bullet), 1);
            }
        }
    }

    // Function for collision detection between bullets and enemies
    function collisionDetection() {
        for (let enemy of enemies) {
            for (let bullet of bullets) {
                if (bullet.x < enemy.x + enemy.width &&
                    bullet.x + bullet.width > enemy.x &&
                    bullet.y < enemy.y + enemy.height &&
                    bullet.y + bullet.height > enemy.y) {
                    bullets.splice(bullets.indexOf(bullet), 1);
                    enemies.splice(enemies.indexOf(enemy), 1);
                    player.score += 10;
                }
            }
            if (player.x < enemy.x + enemy.width &&
                player.x + player.width > enemy.x &&
                player.y < enemy.y + enemy.height &&
                player.y + player.height > enemy.y) {
                player.health--;
                if (player.health <= 0) {
                    gameOver = true;
                }
                enemies.splice(enemies.indexOf(enemy), 1);
            }
        }
    }

    // Function to draw player's score
    function drawScore() {
        ctx.font = '20px Arial';
        ctx.fillStyle = '#fff';
        ctx.fillText('Score: ' + player.score, 10, 30);
    }

    // Function to draw player's health
    function drawHealth() {
        ctx.font = '20px Arial';
        ctx.fillStyle = '#fff';
        ctx.fillText('Health: ' + player.health, canvas.width - 100, 30);
    }

    // Function to draw "Game Over" message
    function drawGameOver() {
        ctx.font = '30px Arial';
        ctx.fillStyle = '#fff';
        ctx.fillText('Game Over!!!', canvas.width / 2 - 120, canvas.height / 2);
        ctx.fillText('Your Score: ' + player.score, canvas.width / 2 - 120, canvas.height / 2 + 50);

        playGameOverSound();

        // Restart button event listener
        document.getElementById('restartButton').addEventListener('click', () => {
            player.x = canvas.width / 2;
            player.y = canvas.height - 50;
            player.health = 3;
            player.score = 0;
            gameOver = false;

            enemies.splice(0, enemies.length);
            bullets.splice(0, bullets.length);

            gameLoop();
        });
    }

    // Function to control the game loop
    function gameLoop() {
        if (!gameOver) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            updatePlayerPosition();
            drawPlayer();

            if (Math.random() < 0.03) {
                createEnemy();
            }
            updateEnemiesPosition();
            drawEnemies();

            updateBulletsPosition();
            drawBullets();

            collisionDetection();

            drawScore();
            drawHealth();

            checkLevelUp(); // Check if the player should level up

            requestAnimationFrame(gameLoop);
        } else {
            drawGameOver();
        }
    }

    // Function to play the shooting sound
    function playShootSound() {
        shootSound.currentTime = 0;
        shootSound.play();
    }

    // Function to play the Game Over sound
    function playGameOverSound() {
        gameOverSound.currentTime = 0;
        gameOverSound.play();
    }

    // Function to update enemies' position
    function updateEnemiesPosition() {
        for (let enemy of enemies) {
            enemy.y += enemy.speed;
            if (enemy.y > canvas.height) {
                enemies.splice(enemies.indexOf(enemy), 1);
            }
        }
    }

    // Restart button event listener
    document.getElementById('restartButton').addEventListener('click', () => {
        player.x = canvas.width / 2;
        player.y = canvas.height - 50;
        player.health = 3;
        player.score = 0;
        gameOver = false;

        enemies.splice(0, enemies.length);
        bullets.splice(0, bullets.length);

        gameLoop();
    });

    gameLoop(); // Start the game loop
});
