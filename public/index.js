import { imgArr } from "./images.js";

// Used to make requsts to the server
class Request {
  async makeRequest(type, route, body) {
    const res = await fetch(route, {
      method: type,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return res;
  }
}

const requestObj = new Request();

// Variable initialisation
let cardsPicked = [];
let cardsPickedId = [];
let cardMatches = 0;
let moves = 0;
const blank = "./images/back.gif";
const girdEl = document.getElementById("grid");
const movesEl = document.getElementById("moves");
const nameEl = document.getElementById("name");
let allCardEl;
let playerName = "";

// Accessing scoreboard elements
const scoreBoardBtnEl = document.getElementById("icon");
const scoreBoardEl = document.getElementsByClassName("scoreboard")[0];
const overlayEl = document.getElementsByClassName("overlay")[0];
const closeScoreBoardEl =
  document.getElementsByClassName("close-scoreboard")[0];

// Adding event listener to scoreboard icon to open scoreboard
scoreBoardBtnEl.addEventListener("click", (e) => {
  overlayEl.style.visibility = "visible";
  scoreBoardEl.style.visibility = "visible";
});

// Adding event listener to scoreboard cross icon to close scoreboard
closeScoreBoardEl.addEventListener("click", (e) => {
  overlayEl.style.visibility = "hidden";
  scoreBoardEl.style.visibility = "hidden";
});

// Accessing initial window elemenents prompting user to create a player
const createPlrWindow = document.getElementsByClassName("createPlayer")[0];
const nameFormEl1 = document.getElementById("name-input1");
const createPlrWindowAnchor1 = document.getElementById("anchor1");
const choosePlrWindow = document.getElementsByClassName("choosePlayer")[0];
const createPlrWindowAnchor2 = document.getElementById("anchor2");
const nameFormEl2 = document.getElementById("name-input2");

// Adding an event listener to the submit button which will close the create plr window if the player is successfully added to the database
nameFormEl1.addEventListener("submit", (e) => {
  e.preventDefault();
  addPlayer();
});

// Adding event listener so that create player window is switched with the choose player window if user clicks the link
createPlrWindowAnchor1.addEventListener("click", (e) => {
  createPlrWindow.style.visibility = "hidden";
  choosePlrWindow.style.visibility = "visible";
});

// Adding event listener so that choose player window is switched with the create player window if user clicks the link
createPlrWindowAnchor2.addEventListener("click", (e) => {
  createPlrWindow.style.visibility = "visible";
  choosePlrWindow.style.visibility = "hidden";
});

// Adding event listener to the choose plr window so that when form is submitted the user will be logged in if credentials match
nameFormEl2.addEventListener("submit", (e) => {
  e.preventDefault();
  logPlayer();
});

// This function makes visible the create plr message window
function createInitialMessage() {
  // making window visible
  createPlrWindow.style.visibility = "visible";
  overlayEl.style.visibility = "visible";
}

// Adds the new player to the database if that player name does not already exist
async function addPlayer() {
  const nameFormEl1 = document.getElementById("name-input1");
  const errorEl = document.getElementById("error1");
  errorEl.textContent = "";

  // Making the requst through the requestObj
  const res = await requestObj.makeRequest("post", nameFormEl1.action, {
    name: nameFormEl1.createPlrName.value,
    score: 100,
    password: nameFormEl1.createPlrPassword.value,
  });

  const status = await res.json();
  // If the player name already exists, a message error is displayed on the message window
  if (status.code == 11000) {
    errorEl.textContent = status.message;
  }
  // Otherwise the window is removed
  else {
    overlayEl.style.visibility = "hidden";
    createPlrWindow.style.visibility = "hidden";
    playerName = nameFormEl1.createPlrName.value;
    nameEl.textContent = playerName;
  }
}

// Logs the player if right password is provided
async function logPlayer() {
  const nameFormEl2 = document.getElementById("name-input2");
  console.log(nameFormEl2);
  const errorEl = document.getElementById("error2");
  errorEl.textContent = "";

  // Making the requst through the requestObj
  const res = await requestObj.makeRequest("post", "/matchPlayer", {
    name: nameFormEl2.choosePlrName.value,
    password: nameFormEl2.choosePlrPassword.value,
  });

  const status = await res.json();

  // check if the status is a match or not and display appropriate message accordingly
  if (status.message == "no match") {
    errorEl.textContent = "Credentials do not match";
  } else if (status.message == "match") {
    // hiding the message window
    choosePlrWindow.style.visibility = "hidden";
    overlayEl.style.visibility = "hidden";
    playerName = nameFormEl2.choosePlrName.value;
    nameEl.textContent = playerName;
  } else {
    // if the player name does not exist
    errorEl.textContent = status.message;
  }
}

// This function sends a request to the server asking to update the score of the current user (if it is better)
async function updateScore() {
  const newScore = movesEl.textContent;

  // Patch requst sent with player's name and current score
  const res = await requestObj.makeRequest("PATCH", "/updateScore", {
    name: playerName,
    newScore: newScore,
  });

  const status = await res.json();
  console.log(status);
}

// Updates the scoreboard by reqeusting from the database all the player sccores
async function updateScoreBoard() {
  const scoreListEl = document.getElementsByClassName("score-list")[0];

  const res = await fetch("/allPlayers");
  const status = await res.json();
  const playersArray = status.data;

  let listEl = "";

  scoreListEl.innerHTML = "";
  for (let i = 0; i < playersArray.length; i++) {
    let hrEl = document.createElement("hr");
    listEl = createListEl(playersArray[i].name, playersArray[i].score);
    scoreListEl.append(listEl, hrEl);
  }
}

// Helper function that creates and returns a list-element for the scoreboard
function createListEl(name, score) {
  const listItemEl = document.createElement("div");
  listItemEl.setAttribute("class", "player-score list-item");
  const p1El = document.createElement("p");
  const p2El = document.createElement("p");

  p1El.textContent = name;
  p2El.textContent = score;
  listItemEl.append(p1El, p2El);

  return listItemEl;
}

// This creates the inital grid of cards
function createGrid() {
  girdEl.innerHTML = "";
  let count = 0;
  allCardEl = [];
  moves = 0;
  movesEl.textContent = 0;
  cardMatches = 0;
  cardsPicked = [];
  cardsPickedId = [];
  imgArr.sort((a, b) => 0.5 - Math.random());
  //Creating an img element for each of the 12 cards and attaching an event listener that calls the flipCard function on click
  imgArr.forEach(() => {
    let img = document.createElement("img");
    img.setAttribute("src", blank);
    img.setAttribute("id", count);
    img.setAttribute("class", "y");
    img.addEventListener("click", flipCard);
    girdEl.appendChild(img);
    count++;
  });
}

// This checks whether the two cards chosen by the player are a match
function checkMatch() {
  allCardEl = document.querySelectorAll("#grid img");

  //If match is found they two cards disappear
  if (
    (cardsPicked[0] == cardsPicked[1]) &
    (cardsPickedId[0] != cardsPickedId[1])
  ) {
    allCardEl[cardsPickedId[0]].style.opacity = 0;
    allCardEl[cardsPickedId[1]].style.opacity = 0;

    // cards that have been matched are marked by changing the class to "n"
    allCardEl[cardsPickedId[0]].setAttribute("class", "n");
    allCardEl[cardsPickedId[1]].setAttribute("class", "n");

    cardMatches++;
  }

  //otherwise the two cards are flipped back
  else {
    allCardEl[cardsPickedId[0]].setAttribute("src", blank);
    allCardEl[cardsPickedId[1]].setAttribute("src", blank);
  }

  // if there have been 6 matches, meaning the are no more cards the game ends by creating a dialogue
  if (cardMatches == 6) {
    updateScore();
    updateScoreBoard();
    createDialogue();
  }

  // The two variables are reinitialised
  cardsPicked = [];
  cardsPickedId = [];
  // Each card that has not been matched has its event listener readded
  for (let card of allCardEl) {
    if (card.getAttribute("class") == "y") {
      card.addEventListener("click", flipCard);
    }
  }
}

// Displays the value of a card and if there are 2 cards flipped, calls the checkMatch function a
// after a delay of 1.5 seconds.
function flipCard() {
  let cardId = this.id;

  this.setAttribute("src", imgArr[cardId].img);
  cardsPickedId.push(cardId);
  cardsPicked.push(imgArr[cardId].name);

  allCardEl = document.querySelectorAll("#grid img");
  if (cardsPicked.length == 2) {
    moves++;
    movesEl.textContent = moves;
    //Removes any event listeners from each card so that no more cards can be clicked while
    // timeout is on
    for (let card of allCardEl) {
      card.removeEventListener("click", flipCard);
    }
    setTimeout(checkMatch, 1500);
  }
}

// This creates the dialogue box that asks the user if they'd like to restart the game
function createDialogue() {
  const dialogueWindowEl = document.getElementById("dialogue");
  dialogueWindowEl.setAttribute("class", "dialogue");
  const dialogueH2El = document.createElement("h2");
  const dialogueH3El = document.createElement("h3");
  const dialogueButton1El = document.createElement("button");
  const dialogueButton2El = document.createElement("button");
  dialogueButton1El.addEventListener("click", function () {
    dialogueWindowEl.setAttribute("class", "nothing");
    dialogueWindowEl.innerHTML = "";
    createGrid();
  });

  dialogueButton2El.addEventListener("click", (e) => {
    dialogueWindowEl.setAttribute("class", "nothing");
    dialogueWindowEl.innerHTML = "";
    createGrid();
    createInitialMessage();
  });

  dialogueH2El.textContent = "Gongratulations! You Won!!!";
  dialogueWindowEl.appendChild(dialogueH2El);
  dialogueH3El.textContent = "Start new game?";
  dialogueWindowEl.appendChild(dialogueH3El);
  dialogueButton1El.textContent = "Start Game";
  dialogueWindowEl.appendChild(dialogueButton1El);
  dialogueButton2El.textContent = "Switch Player";
  dialogueWindowEl.appendChild(dialogueButton2El);
}

// Create the card grid
createGrid();
// Load the message window asking the player's name
createInitialMessage();
updateScoreBoard();
