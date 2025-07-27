// Pages
const gamePage = document.getElementById("game-page");
const scorePage = document.getElementById("score-page");
const splashPage = document.getElementById("splash-page");
const countdownPage = document.getElementById("countdown-page");
// Splash Page
const startForm = document.getElementById("start-form");
const radioContainers = document.querySelectorAll(".radio-container");
const radioInputs = document.querySelectorAll("input");
const bestScores = document.querySelectorAll(".best-score-value");
// Countdown Page
const countdown = document.querySelector(".countdown");
// Game Page
const itemContainer = document.querySelector(".item-container");
// Score Page
const finalTimeEl = document.querySelector(".final-time");
const baseTimeEl = document.querySelector(".base-time");
const penaltyTimeEl = document.querySelector(".penalty-time");
const playAgainBtn = document.querySelector(".play-again");

// Equations
let questionsAmount = 0; // How many questions to ask
let equationsArray = [];
let playerGuessArray = []; // Player's answers

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = "0.0s";

// Scroll
let valueY = 0;

// Reset the game
function playAgain() {
  gamePage.addEventListener("click", startTimer); // Re-add the event listener
  scorePage.hidden = true;
  splashPage.hidden = false; // Show the splash page
  // Reset all variables
  equationsArray = [];
  playerGuessArray = [];
  valueY = 0;
  playAgainBtn.hidden = true; // Hide the play again button
}

// Show the Score Page
function showScorePage() {
  // Show play again button after 1 second
  setTimeout(() => {
    playAgainBtn.hidden = false;
  }, 1000);
  gamePage.hidden = true;
  scorePage.hidden = false;
}

// Score to Dom / Format and Display time in DOM
function scoresToDOM() {
  finalTimeDisplay = finalTime.toFixed(1);
  baseTime = timePlayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);
  baseTimeEl.textContent = `Base Time: ${baseTime}s`;
  penaltyTimeEl.textContent = `Penalty: +${penaltyTime}s`;
  finalTimeEl.textContent = `${finalTimeDisplay}s`;
  // Scroll to top of the page
  itemContainer.scrollTo({ top: 0, behavior: "instant" });
  showScorePage();
}

// Stop the timer and calculate final time
function checkTime() {
  console.log(timePlayed);
  if (playerGuessArray.length == questionsAmount) {
    console.log("playerGuessArray", playerGuessArray);
    clearInterval(timer); // Stop the timer

    // Check for wrong guesses and add penalty time
    equationsArray.forEach((equation, index) => {
      if (equation.evaluated === playerGuessArray[index]) {
        // Correct guess, do nothing
      } else {
        // Incorrect guess, add penalty time
        penaltyTime += 0.5; // Add 0.5 seconds for each wrong guess
      }
    });
    finalTime = timePlayed + penaltyTime; // Calculate final time
    console.log(
      `timePlayed: ${timePlayed}, penaltyTime: ${penaltyTime}, finalTime: ${finalTime}`
    );
    scoresToDOM(); // Update the score display in the DOM
  }
}

// Add a tenth of a second to the time played
function addTime() {
  timePlayed += 0.1;
  checkTime();
}

// Start Timer when game is clicked
function startTimer() {
  // Reset Time
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(addTime, 100); // Add time every 100ms
  gamePage.removeEventListener("click", startTimer); // Remove the event listener to prevent multiple timers
}

// Scroll, store user selection in playerGuessArray
function select(guessTrue) {
  // Scroll 80 pixels up
  valueY += 80;
  itemContainer.scroll(0, valueY);
  // Add player's guess to the array
  return guessTrue
    ? playerGuessArray.push("true")
    : playerGuessArray.push("false");
}

// Display the Game Page
function showGamePage() {
  gamePage.hidden = false;
  countdownPage.hidden = true;
}

// get Random Number up to a max number
function getRandomNumber(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomNumber(questionsAmount);
  console.log(`Correct Equations: ${correctEquations}`);
  // Set amount of wrong equations
  const wrongEquations = questionsAmount - correctEquations;
  console.log(`Wrong Equations: ${wrongEquations}`);
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomNumber(9);
    secondNumber = getRandomNumber(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: "true" };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomNumber(9);
    secondNumber = getRandomNumber(9);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomNumber(3);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: "false" };
    equationsArray.push(equationObject);
  }
  // Shuffle the equations array
  shuffle(equationsArray);
}

// Display equations in the DOM
function equationsToDOM() {
  equationsArray.forEach((equation) => {
    // Item
    const item = document.createElement("div");
    item.classList.add("item");
    // equation text
    const equationText = document.createElement("h1");
    equationText.textContent = equation.value;
    // append
    item.appendChild(equationText);
    itemContainer.appendChild(item);
  });
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = "";
  // Spacer
  const topSpacer = document.createElement("div");
  topSpacer.classList.add("height-240");
  // Selected Item
  const selectedItem = document.createElement("div");
  selectedItem.classList.add("selected-item");
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  equationsToDOM();

  // Set Blank Space Below
  const bottomSpacer = document.createElement("div");
  bottomSpacer.classList.add("height-500");
  itemContainer.appendChild(bottomSpacer);
}

// Display 3, 2 ,1 countdown
function countdownStart() {
  countdown.textContent = "3";
  setTimeout(() => {
    countdown.textContent = "2";
  }, 1000);
  setTimeout(() => {
    countdown.textContent = "1";
  }, 2000);
  setTimeout(() => {
    countdown.textContent = "Go!";
  }, 3000);
}

// Navigate to the Countdown Page from the Splash Page
function showCountdown() {
  countdownPage.hidden = false;
  splashPage.hidden = true;
  countdownStart();
  populateGamePage();
  setTimeout(showGamePage, 4000); // Show Game Page after countdown
}

// Get the value of the radio input
function getRadioValue() {
  let radioValue;
  radioInputs.forEach((radioInput) => {
    if (radioInput.checked) {
      radioValue = radioInput.value;
    }
  });
  return radioValue;
}

// Form that decides how many questions to ask
function selectQuestionAmount(e) {
  e.preventDefault();
  questionsAmount = getRadioValue();
  console.log(`Questions Amount: ${questionsAmount}`);
  if (questionsAmount) {
    showCountdown();
  }
}

startForm.addEventListener("click", (e) => {
  radioContainers.forEach((radioEl) => {
    // Remove Selected Label Styling
    radioEl.classList.remove("selected-label");
    // Add it back if the input is checked
    if (radioEl.children[1].checked) {
      radioEl.classList.add("selected-label");
    }
  });
});

// Event Listeners
startForm.addEventListener("submit", selectQuestionAmount);
gamePage.addEventListener("click", startTimer);
