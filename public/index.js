let imgArr = [
  {
    name: "bird",
    img: "./images/bird.png",
  },

  {
    name: "cat",
    img: "./images/cat.png",
  },

  {
    name: "dog",
    img: "./images/dog.png",
  },

  {
    name: "hamburger",
    img: "./images/hamburger.png",
  },

  {
    name: "cheese",
    img: "./images/cheese.png",
  },

  {
    name: "pizza",
    img: "./images/pizza.png",
  },

  {
    name: "bird",
    img: "./images/bird.png",
  },

  {
    name: "cat",
    img: "./images/cat.png",
  },

  {
    name: "dog",
    img: "./images/dog.png",
  },

  {
    name: "hamburger",
    img: "./images/hamburger.png",
  },

  {
    name: "cheese",
    img: "./images/cheese.png",
  },

  {
    name: "pizza",
    img: "./images/pizza.png",
  },
];

// Variable initialisation
let cardsPicked = [];
let cardsPickedId = [];
let cardMatches = 0;
let moves = 0;
const blank = "./images/back.gif";
const girdEl = document.getElementById("grid");
const movesEl = document.getElementById("moves");
let allCardEl;

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

// This function makes visible the message window that asks the player's name
const initialDialogue = document.getElementsByClassName("initial-message")[0];
const initialDialogueBtn = document.getElementsByClassName("name-btn")[0];
function createInitialMessage() {
  // making window visible
  initialDialogue.style.visibility = "visible";
  overlayEl.style.visibility = "visible";

  // adding an event listener to the submit button which will close the window if the player is successfully added to the database
  initialDialogueBtn.addEventListener("click", (e) => {
    e.preventDefault();
    addPlayer();
  });
}

// Adds the new player to the user if that player name does not already exist
async function addPlayer() {
  const nameFormEl = document.getElementById("name-input");
  const errorEl = document.getElementsByClassName("error")[0];
  errorEl.textContent = "";

  // post request to /addPlayer with player's name and a default score value of 100
  const res = await fetch(nameFormEl.action, {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      name: nameFormEl.plrName.value,
      score: 10,
    }),
  });

  const status = await res.json();
  // If the player name is already exists, a message error is displayed on the message window
  if (status.code == 11000) {
    errorEl.textContent =
      "That player already exists. Please try a different name";
    // Otherwise the window is removed
  } else {
    overlayEl.style.visibility = "hidden";
    initialDialogue.style.visibility = "hidden";
  }
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
  const cross = document.createElement("img");
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
  cross.src = "./images/cross.png";
  cross.addEventListener("click", function () {
    dialogueWindowEl.setAttribute("class", "nothing");
    dialogueWindowEl.innerHTML = "";
  });
  dialogueWindowEl.appendChild(cross);
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
