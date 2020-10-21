const MAIN_URL = "http://localhost:3000"

window.addEventListener('load', () => {
    getDecks();
        //attachClickToDeckLinks()
        //displayCreateForm()
})

//get - index
function getDecks() {
    clearForm();
    let main = document.querySelector("#main-list ul")
    fetch(MAIN_URL + "/decks")
        .then(resp => resp.json())
        .then(decks => {
            main.innerHTML += decks.map(deck => {
                let newDeck = new Deck(deck)
                return newDeck.renderDeck()
                    //return string and put into new array with map, then returns new array filled with string then need to join
            }).join("");
            attachClickToDeckLinks();
        })
}

function clearForm() {
    let deckFormDiv = document.getElementById("deck-form")
    deckFormDiv.innerHTML = ''
}

function attachClickToDeckLinks() {
    let decks = document.querySelectorAll("li a")
    decks.forEach(deck => {
        deck.addEventListener('click', displayDeck)
    })
}

function displayCreateForm() {
    let deckFormDiv = document.getElementById("deck-form")
    let html = `
        <form onsubmit="createDeck(); return false;">
        <label>Topic</label>
        <input type="text" id="name">
        <input type="submit" value="Create New Deck">    
    `
    deckFormDiv.innerHTML = html

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
            document.querySelector("#main-list ul").innerHTML += deckInstance.renderDeck();

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
    let main = document.querySelector("#main-list ul");
    main.innerHTML = ""
    fetch(MAIN_URL + `/decks/${id}`)
        .then(resp => resp.json())
        .then(deck => {
            for (const card of deck.cards) {
                renderFlashcard(card);
            }
        })
}

function renderFlashcard(card) {
    const cardInfo = document.querySelector("#main-list ul");
    //below displays card
    cardInfo.innerHTML += `
    

    <div class="flipCard">
        <div class="card" onclick="this.classList.toggle('flipped');">
            <div class="side front">${card.card_front}</div>
            <div class="side back">${card.card_back}</div>
        </div>
        <br>
        <div class=buttons>
            <button data-id=${card.id} onclick="editCard(${card.id})"; return false;>Edit</button>
            <button data-id=${card.id} onclick="removeCard(${card.id})"; return false;>Delete</button></li>
        </div>
    </div>
    
    `
    //attachClickToCardLinks()
}

// function attachClickToCardLinks() {
//     let cards = document.querySelectorAll(" a")
//     cards.forEach(card => {
//         card.addEventListener('click', renderBack)
//     })
// }

function editCard(cardId) {
    //console.log(cardId);
    //clearForm();
    fetch(MAIN_URL + `/decks/${id}`)
        .then(resp => resp.json())
        .then(deck => {
            let cardFormDiv = document.getElementById("card-form")
            let html = `
            <form onsubmit="updateDeck(${id});return false;">
            <label>Name:</label>
            <input type ="text" id="name" value="${deck.name}"></br>
        
            <input type ="submit" value="Submit Edit">
        `
            cardFormDiv.innerHTML = html
        })
}


//delete route
function removeDeck(id) {
    clearForm()
    fetch(MAIN_URL + `/decks/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
        .then(event.target.parentElement.remove())
}

function editDeck(id) {
    clearForm()
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
            deckFormDiv.innerHTML = html
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
                <a href="#" data-id="${deck.id}">${deck.name}</a>
                <button data-id=${deck.id} onclick="editDeck(${deck.id})"; return false;>Edit</button>
                <button data-id=${deck.id} onclick="removeDeck(${deck.id})"; return false;>Delete</button>
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
        <a href="#" data-id="${this.id}">${this.name}</a>
        <button data-id=${this.id} onclick="editDeck(${this.id})"; return false;>Edit</button>
        <button data-id=${this.id} onclick="removeDeck(${this.id})"; return false;>Delete</button></li>
         
        `
    }
}