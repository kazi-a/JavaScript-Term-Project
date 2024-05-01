var score = 0;
var lives = 3;
var moles = []; // Initialize the moles array
var moleInterval; // Declare moleInterval globally
var killshotSound = new Audio('media/killshot.mp3'); // Load killshot sound
var gameOverSound = new Audio('media/game-over.mp3'); // Load game over sound

// Event listener for the start button
document.getElementById("startButton").addEventListener("click", startGame);

// Function to start the game
function startGame() {
    // Reset score and lives
    score = 0;
    lives = 3;
    updateScore(); // Update score display
    updateLives(); // Update lives display
    // Remove existing moles from the grid
    moles.forEach(mole => mole.remove());
    moles = []; // Clear the moles array

    // Determine game level based on selected option
    var level = document.getElementById("level").value;
    var moleCount, interval;

    // Set grid size, mole count, and interval based on the selected level
    if (level === "easy") {
        document.documentElement.style.setProperty('--grid-size', 4);
        moleCount = 16;
        interval = 800;
    } else if (level === "medium") {
        document.documentElement.style.setProperty('--grid-size', 5);
        moleCount = 25;
        interval = 600;
    } else if (level === "hard") {
        document.documentElement.style.setProperty('--grid-size', 6);
        moleCount = 36;
        interval = 400;
    }

    // Create moles and add them to the grid
    for (let i = 0; i < moleCount; i++) {
        const mole = document.createElement("div");
        mole.classList.add("mole");
        mole.addEventListener("click", whack);
        mole.style.backgroundImage = "url('media/mole.jpg')";
        document.getElementById("gridContainer").appendChild(mole);
        moles.push(mole); // Add mole to the moles array
    }

    // Start the mole popping interval
    popMole();
    moleInterval = setInterval(popMole, interval); // Assign interval ID to moleInterval
}

// Function to randomly activate a mole
function popMole() {
    // Deactivate all moles
    moles.forEach(mole => mole.classList.remove("active"));
    // Activate a random mole
    const randomIndex = Math.floor(Math.random() * moles.length);
    moles[randomIndex].classList.add("active");
}

// Function to decrease lives when player misses a mole
function decreaseLives() {
    lives--;
    updateLives(); // Update lives display
    // End game if lives are depleted
    if (lives == 0) {
        clearInterval(moleInterval); // Clear the interval using the stored ID
        gameOverSound.play(); // Play game over sound
        alert("Game Over! Your score: " + score);
    }
}

// Function to handle whacking a mole
function whack() {
    // If mole is active, increase score and deactivate mole
    if (this.classList.contains("active")) {
        score++;
        this.classList.remove("active");
        updateScore(); // Update score display
        killshotSound.play(); // Play killshot sound
    } else {
        decreaseLives(); // Decrease lives if player misses
    }
}

// Function to update the score display
function updateScore() {
    document.getElementById("score").textContent = score;
}

// Function to update the lives display
function updateLives() {
    document.getElementById("lives").textContent = lives;
}
