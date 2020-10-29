const MAIN_URL = "http://localhost:3000";

window.addEventListener('load', () => {
    getDecks();
        //attachClickToDeckLinks()
        //displayCreateForm()
       
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
    deckFormDiv.innerHTML = ''
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

    // <p><label>Question</label>
    // <input type="text" id="cards[question]">
    // <label>Answer</label>
    // <input type="text" id="cards[answer]"></p>

    // <p><label>Question</label>
    // <input type="text" id="cards[question]">
    // <label>Answer</label>
    // <input type="text" id="cards[answer]"></p>

}

//post - create
function createDeck() {
    const deck = {
        name: document.getElementById("name").value,
        // cards: [{
        //     question: document.getElementById("cards[question]").value,
        //     answer: document.getElementById("cards[answer]").value,

        // }]

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
            //console.log(deckInstance);
            //document.querySelector("#main-list ul").innerHTML += `
            //<li><a href="#" data-id="${deck.id}">${deck.name}</a>
            //<button data-id=${deck.id} onclick="editDeck(${deck.id})"; return false;>Edit</button>
            //<button data-id=${deck.id} onclick="removeDeck(${deck.id})"; return false;>Delete</button></li>
            //`

            attachClickToDeckLinks();
            clearForm();
        })
}


//get - show route
function displayDeck(event) {
    //console.log(event)
    event.preventDefault();
    clearForm();
    let id = this.dataset.id;
    let main = document.querySelector("#deck-list ul");
    main.style = "visibility: hidden;"
    fetch(MAIN_URL + `/decks/${id}`)
        .then(resp => resp.json())
        .then(deck => {
            for (const card of deck.cards) {
                renderFlashcard(card);
            }
        })
}

function renderFlashcard(card) {
    const cardInfo = document.querySelector("#flashcard-list");
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
            <button data-id=${card.id} onclick="removeCard(${card.id})"; return false;>Delete</button></li>
        </div>
    </div>
    <br>
    
    `
    //attachClickToCardLinks()
    //console.log(cardInfo) --shows deck_id

    cardInfo.style = "visibility: visible;";
    displayForms(); //keep because this allows card form link to show
    //displayForms(card.deck_id); -- allows FC form to show 
    //console.log(card.deck_id)
    //displayCreateCardForm(card.deck_id); -- makes FC form not show
}

// function attachClickToCardLinks() {
//     let cards = document.querySelectorAll(" a")
//     cards.forEach(card => {
//         card.addEventListener('click', renderBack)
//     })
// }




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
        .then(event.target.parentElement.remove());
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
            <input type ="text" id="name" value="${deck.name}"></br>
        
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

/* ALL FLASHCARD CODE */

/* this function will need to pull deck id
so flashcard is assigned to correct deck*/
function displayCreateCardForm() {
    let cardFormDiv = document.getElementById("card-form");
    let deckID = document.getElementById("deck_id").innerHTML;
    let html = `
        <form onsubmit="createFlashcard(); return false;">
        <label>Flashcard Front</label>
        <input type="text" id="card_front">
        <label>Flashcard Back</label>
        <input type="text" id="card_back">
        <input type="hidden" id="deck_id" name="deck_id" value="${deckID}">
        <input type="submit" value="Create New FlashCard">    
    `
    cardFormDiv.innerHTML = html;

    console.log(cardFormDiv)
    console.log(deckID)
}

//post - create for flashcard
//need to take in an id to identify which deck it is for?
function createFlashcard() {
   const card = {
        card_front: document.getElementById("card_front").value,
        card_back: document.getElementById("card_back").value,
        deck_id: document.getElementById("deck_id").value,
    }
    
    console.log(card);

    // fetch(MAIN_URL + "/cards", {
    //         method: "POST",
    //         body: JSON.stringify(card),
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Accept": "application/json"
    //         }
    //     })
    //     .then(resp => resp.json())
    //     .then (card => {
    //         console.log(card)
    //     })
    //     .then(deck => {
    //         let deckInstance = new Deck(deck)
    //         document.querySelector("#main-list ul").innerHTML += deckInstance.renderDeck();

    //         //document.querySelector("#main-list ul").innerHTML += `
    //         //<li><a href="#" data-id="${deck.id}">${deck.name}</a>
    //         //<button data-id=${deck.id} onclick="editDeck(${deck.id})"; return false;>Edit</button>
    //         //<button data-id=${deck.id} onclick="removeDeck(${deck.id})"; return false;>Delete</button></li>
    //         //`

    //         attachClickToDeckLinks();
    //         clearForm();
    //     })
}


//delete flashcard function
function removeCard(id) {
    //clearCardForm();
    //console.log(id);
    if (confirm ('Are you sure you want to delete the flashcard? This is irreversible.')) {
    fetch(MAIN_URL + `/cards/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
        //console.log(event.target.offsetParent);
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
            <form onsubmit="updateCard(${card.id});return false;">
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
    //console.log(id);
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
                document.querySelectorAll(`li a[data-id="${id}"]`)[0].parentElement.innerHTML = `
                <a href="#" data-id="${card.card_front}">${card.card_front}</a>
                <a href="#" data-id="${card.card_back}">${card.card_back}</a>
                <button data-id=${card.id} onclick="editDeck(${card.id})"; return false;>Edit</button>
                <button data-id=${card.id} onclick="removeDeck(${card.id})"; return false;>Delete</button>
                `
                //clearForm();
            }

        )
}
