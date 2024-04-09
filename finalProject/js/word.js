// Define audio elements for game sounds
const $soundNormal = $("<audio preload=auto>").attr("src", "media/coin.mp3");
const $soundLose = $("<audio preload=auto>").attr("src", "media/wrong.mp3");
const $soundSpecial = $("<audio preload=auto>").attr("src", "media/laser4.mp3");

// Append audio elements to the body
$("body").append($soundNormal, $soundLose, $soundSpecial);

// Extract word list from HTML and split into an array of words
const wordList = $("#game-words").text().trim().split(/\s+/);

// Function to generate a random word from the word list
const randomWord = () => {
    const len = wordList.length;
    const randIdx = Math.floor(Math.random() * len);
    return wordList[randIdx];
};

function replaceAt(string, index, character) {
    // Split the string into two parts: before and after the index
    const before = string.slice(0, index);
    const after = string.slice(index + 1);
    
    // Concatenate the parts with the replacement character in between
    return before + character + after;
}

// Function to scramble a word using a different algorithm
const scrambleWord = (word) => {
    // Convert the word to an array of characters
    const characters = word.split('');
    const scrambledCharacters = [];

    // Scramble the word by randomly selecting characters
    while (characters.length > 0) {
        // Randomly select an index from the remaining characters
        const randomIndex = Math.floor(Math.random() * characters.length);
        // Remove the selected character from the array and push it to the scrambled word
        scrambledCharacters.push(characters.splice(randomIndex, 1)[0]);
    }

    // Join the scrambled characters back into a string
    return scrambledCharacters.join('');
};

// Function to set a random word and display its scrambled version
const setRandomWord = () => {
    const $wordElement = $("#game-form").find(".scrambled-word");
    const newWord = randomWord();
    const scrambledWord = scrambleWord(newWord);
    $wordElement.text(scrambledWord);
    return newWord;
};

// Initialize the current word with a random word
let currentWord = setRandomWord();

// Function to get the current points from the display
const getPoints = () => {
    return parseInt($("#score-display").text().match(/\d+/)[0]);
};

// Function to set the points on the display
const setPoints = (points) => {
    $("#score-display").html("Points: " + points);
};

// Function to play audio based on the points
const playAudio = (points) => {
    points % 10 !== 0 ? $soundNormal[0].play() : $soundSpecial[0].play();
};

// Function to display a message based on the points
const displayMessage = (points) => {
    let message = "Your Points: " + points + " ,";
    if (points >= 20) {
        message += " You're a Superstar!";
    } else if (points >= 10) {
        message += " You're doing great!";
    } else if (points >= 5) {
        message += " You're getting there!";
    } else {
        message += " Keep trying!";
    }
    if (points === 0) {
        message = "Oops! Try again.";
    }
    $("#game-messages").html("<br><br>" + message);
};

// Event listener for form submission
$("#game-form").on("submit", function(event) {
    event.preventDefault();

    // Get user input and correct answer, convert to uppercase for case-insensitive comparison
    const $userInput = $(this).find("[type=text]").val().toUpperCase();
    const $correctAnswer = currentWord.toUpperCase();

    // Check if the user input matches the correct answer
    const isCorrect = $userInput === $correctAnswer;

    // Update points, display message, and play audio based on correctness
    if (isCorrect) {
        displayMessage(getPoints() + 2);
        setPoints(getPoints() + 2);
        currentWord = setRandomWord();
        $(this).find("[type=text]").val("");
        playAudio(getPoints());
    } else {
        displayMessage(getPoints());
        setPoints(0);
        $soundLose[0].play();
        currentWord = setRandomWord();
    }
});
