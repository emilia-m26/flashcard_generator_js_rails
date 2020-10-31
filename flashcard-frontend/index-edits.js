const MAIN_URL = "http://localhost:3000";

window.addEventListener('load', () => {
    getDecks();    
})


//get - index
function getDecks() {
    clearForm();
    let main = document.querySelector("#deck-list ul");
    fetch(MAIN_URL + "/decks")
        .then(resp => resp.json())
        .then(decks => {
            main.innerHTML += decks.map(deck => {
                let newDeck = new Deck(deck)
                return newDeck.renderDeck()
                    //return string and put into new array with map, then returns new array filled with string then need to join
            }).join("");
            attachClickToDeckLinks();
            main.style = "visibility: visible;";
            displayForms();
        })
}

function clearForm() {
    let deckFormDiv = document.getElementById("deck-form");
    let cardFormDiv = document.getElementById("card-form");
    let main = document.querySelector("#deck-list ul");
     
    if (main.style.visibility === "visible") {
        deckFormDiv.innerHTML = ''
    } else {
        cardFormDiv.innerHTML = ''
    }
}

function attachClickToDeckLinks() {
    let decks = document.querySelectorAll("li a");
    decks.forEach(deck => {
        deck.addEventListener('click', displayDeck)
    });
}

function displayForms() {
    let main = document.querySelector("#deck-list ul")
    let deckFormDisplay = document.querySelector('#deck-create-form');
    let cardFormDisplay = document.querySelector('#card-create-form');
    deckFormDisplay.style.visibility = "hidden";
    cardFormDisplay.style.visibility = "hidden";
    if (main.style.visibility === "visible") {
      deckFormDisplay.style.visibility = "visible";
      cardFormDisplay.style.visibility = "hidden";
    } else {
      deckFormDisplay.style.visibility = "hidden";
      cardFormDisplay.style.visibility = "visible";
    }
    
}

function displayCreateForm() {
    let deckFormDiv = document.getElementById("deck-form");
    let html = `
        <form onsubmit="createDeck(); return false;">
        <label>Topic</label>
        <input type="text" id="name">
        <input type="submit" value="Create New Deck">    
    `
    deckFormDiv.innerHTML = html;
}

//post - create
function createDeck() {
    const deck = {
        name: document.getElementById("name").value,
    }
    fetch(MAIN_URL + "/decks", {
        method: "POST",
        body: JSON.stringify(deck),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
    .then(resp => resp.json())
    .then(deck => {
        let deckInstance = new Deck(deck)
        document.querySelector("#deck-list ul").innerHTML += deckInstance.renderDeck();
        attachClickToDeckLinks();
        clearForm();
    })
}


//get - show route - pulling info for displaying flashcards
function displayDeck(event) {
    event.preventDefault();
    clearForm();
    let id = this.dataset.id;
    let main = document.querySelector("#deck-list ul");
    main.style = "visibility: hidden;"
    main.innerHTML = '';
    displayForms();
    fetch(MAIN_URL + `/decks/${id}`)
        .then(resp => resp.json())
        .then(deck => {
            if(deck.cards.length === 0) {
                renderFlashcardNoCards(deck.id)
            } else {
            for (const card of deck.cards) {
                renderFlashcard(card);
            }
        }
    })
}

function renderFlashcardNoCards(id) {
    let cardInfo = document.querySelector("#flashcard-list");
    cardInfo.innerHTML += `
    <div id="deck_id" value="${id}" style="visibility: hidden;">${id}</div>
    `
}

function renderFlashcard(card) {
    let cardInfo = document.querySelector("#flashcard-list");
    //below displays card
    cardInfo.innerHTML += `
    <div class="flipCard">
        <div class="card" onclick="this.classList.toggle('flipped');">
            <div class="side front">${card.card_front}</div>
            <div class="side back">${card.card_back}</div>
            <div id="deck_id" value="${card.deck_id}" style="visibility: hidden;">${card.deck_id}</div>
        </div>
        <br>
        <div class=buttons>
            <button data-id=${card.id} onclick="editCard(${card.id})"; return false;>Edit</button>
            <button data-id=${card.id} onclick="removeCard(${card.id})"; return false;>Delete</button>
        </div>
    </div>
    <br>
    `
}

//delete route
function removeDeck(id) {
    clearForm();
    if (confirm ('Are you sure you want to delete the deck? This is irreversible.')) {
    fetch(MAIN_URL + `/decks/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
            }
        })
        .then(event.target.parentElement.parentElement.parentElement.remove());
    }
}

function editDeck(id) {
    clearForm();
    fetch(MAIN_URL + `/decks/${id}`)
        .then(resp => resp.json())
        .then(deck => {
            let deckFormDiv = document.getElementById("deck-form")
            let html = `
            <form onsubmit="updateDeck(${id});return false;">
            <label>Name:</label>
            <input type ="text" id="name" value="${deck.name}">
            </br>
            <input type ="submit" value="Submit Edit">
            `
            deckFormDiv.innerHTML = html;
        })
}

//patch to update route
function updateDeck(id) {
    const deck = {
        name: document.getElementById("name").value,
    }
    fetch(MAIN_URL + `/decks/${id}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(deck)
    })
    .then(resp => resp.json())
    .then(deck => {
        document.querySelectorAll(`li a[data-id="${id}"]`)[0].parentElement.innerHTML = `
            <li>
            <a href="#" data-id="${deck.id}">${deck.name}</a>
            <p>
            <button data-id=${deck.id} onclick="editDeck(${deck.id})"; return false;>Edit</button>
            <button data-id=${deck.id} onclick="removeDeck(${deck.id})"; return false;>Delete</button>
            </p>
            </li>
            `
        attachClickToDeckLinks();
        clearForm();
        }
     )
}

//OOJS
class Deck {
    constructor(deck) {
        this.id = deck.id
        this.name = deck.name
    }
    renderDeck() {
        return `
        <li>
        <div class="deck">
        <img src="images/cards.jpg" alt="Avatar" style="width:100%">
        <div class="container">
        <a href="#" data-id="${this.id}">${this.name}</a>
        <p>
        <button data-id=${this.id} onclick="editDeck(${this.id})"; return false;>Edit</button>
        <button data-id=${this.id} onclick="removeDeck(${this.id})"; return false;>Delete</button>
        </p>
        </div>
        </div>
         </li>
        `
    }
   
}

class Card {
    constructor(card) {
        this.id = card.id
        this.card_front = card.card_front
        this.card_back = card.card_back
        this.category = card.category
        this.deck_id = card.deck_id
    }
    renderFlashcard() {
        return `
        <div class="flipCard">
        <div class="card" onclick="this.classList.toggle('flipped');">
            <div class="side front">${this.card_front}</div>
            <div class="side back">${this.card_back}</div>
            <div id="deck_id" data-id="${this.deck_id}" style="visibility: hidden;">${this.deck_id}</div>
        </div>
        <br>
        <div class=buttons>
            <button data-id=${this.id} onclick="editCard(${this.id})"; return false;>Edit</button>
            <button data-id=${this.id} onclick="removeCard(${this.id})"; return false;>Delete</button>
        </div>
    </div>
    <br>
    `
    }
}

/* ALL FLASHCARD CODE */

function displayCreateCardForm() {
    let cardFormDiv = document.getElementById("card-form");
    let deckID = document.getElementById("deck_id").innerHTML;
    let html = `
        <form onsubmit="createFlashcard(); return false;">
        <label>Flashcard Front</label>
        <input type="text" id="card_front">
        <label>Flashcard Back</label>
        <input type="text" id="card_back">
        <label>Flashcard Category</label>
        <input type="text" id="category">
        <input type="hidden" id="deck_id" name="deck_id" value="${deckID}">
        <input type="submit" value="Create New FlashCard">    
    `
    cardFormDiv.innerHTML = html;
}

//post - create for flashcard
function createFlashcard() {
   const card = {
        card_front: document.getElementById("card_front").value,
        card_back: document.getElementById("card_back").value,
        deck_id: document.getElementById("deck_id").value,
        category: document.getElementById("category").value,
    }
    fetch(MAIN_URL + "/cards", {
        method: "POST",
        body: JSON.stringify(card),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
    .then(resp => resp.json())
    .then (card => {
        let cardInstance = new Card(card)
        document.querySelector("#flashcard-list").innerHTML += cardInstance.renderFlashcard();
    })
    clearForm();
}


//delete flashcard function
function removeCard(id) {
    //clearCardForm();
    if (confirm ('Are you sure you want to delete the flashcard? This is irreversible.')) {
    fetch(MAIN_URL + `/cards/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
    .then(event.target.offsetParent.remove());
    }
}

function editCard(id) {
    //clearForm();
    fetch(MAIN_URL + `/cards/${id}`)
        .then(resp => resp.json())
        .then(card => {
            let cardFormDiv = document.getElementById("card-form")
            let html = `
            <form onsubmit="updateCard(${id});return false;">
            <label>Flashcard Front:</label>
            <input type ="text" id="card_front" value="${card.card_front}"></br>
            <label>Flashcard Back:</label>
            <input type ="text" id="card_back" value="${card.card_back}"></br>
            <input type ="submit" value="Submit Edit">
        `
        cardFormDiv.innerHTML = html;
    })
}

//patch to update route - flashcards
function updateCard(id) {
    const card = {
        card_front: document.getElementById("card_front").value,
        card_back: document.getElementById("card_back").value,
    }
    fetch(MAIN_URL + `/cards/${id}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(card)
    })
    .then(resp => resp.json())
    .then(card => {
        document.querySelectorAll(`.flipCard .buttons button[data-id="${card.id}"]`)[0].parentElement.parentElement.innerHTML = `
            <div class="card" onclick="this.classList.toggle('flipped');">
                <div class="side front">${card.card_front}</div>
                <div class="side back">${card.card_back}</div>
                <div id="deck_id" value="${card.deck_id}" style="visibility: hidden;">${card.deck_id}</div>
            </div>
            <br>
            <div class=buttons>
                <button data-id=${card.id} onclick="editCard(${card.id})"; return false;>Edit</button>
                <button data-id=${card.id} onclick="removeCard(${card.id})"; return false;>Delete</button>
            </div>       
                `
        clearForm();
    })
}


