const MAIN_URL = "http://localhost:3000"

window.addEventListener('load', () => {
    // getDecks()
    //attachClickToDeckLinks()
    //displayCreateForm()
})

function displayToy(toy) {
    //display each toy on page
    //attach to DOM
    let toyCollection = document.querySelector("#toy-collection")
    toyCollection.innerHTML += toyCard(toy)
}

//this happens fifth
function toyCard(toy) {
    //backticks to do string interpolation
    //html template for card
    return ` 
  <div class="card">
    <h2>${toy.name}</h2>
    <img src=${toy.image} class="toy-avatar" />
    <p>${toy.likes} </p>
    <button class="like-btn">Like <3</button>
  </div>
`
}

function getDecks() {
    clearForm()
    let main = document.querySelector("#main-list ul")
    fetch(MAIN_URL + "/decks")
        .then(resp => resp.json())
        .then(decks => {
            main.innerHTML += decks.map(deck => {
                let newDeck = new Deck(deck)
                return newDeck.renderDeck()
                    //return string and put into new array with map, then returns new array filled with string then need to join
            }).join("")
            attachClickToDeckLinks()
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

        <p><label>Question</label>
        <input type="text" id="cards[question]">
        <label>Answer</label>
        <input type="text" id="cards[answer]"></p>

        <p><label>Question</label>
        <input type="text" id="cards[question]">
        <label>Answer</label>
        <input type="text" id="cards[answer]"></p>
        
        <input type="submit" value="Create New Deck">    
    `
    deckFormDiv.innerHTML = html
}


function createDeck() {
    const deck = {
        name: document.getElementById("name").value,
        cards: [{
            question: document.getElementById("cards[question]").value,
            answer: document.getElementById("cards[answer]").value,
            //deck_id: deck.id
        }]

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
            document.querySelector("#main-list ul").innerHTML += `
            <li><a href="#" data-id="${deck.id}">${deck.name} - (${deck.cards.length})</a>
            <button data-id=${deck.id} onclick="editDeck(${deck.id})"; return false;>Edit</button>
            <button data-id=${deck.id} onclick="removeDeck(${deck.id})"; return false;>Delete</button></li>
            `
            attachClickToDeckLinks()
            clearForm()
        })
}

//show route
function displayDeck(event) {
    event.preventDefault()
    clearForm()
    let id = this.dataset.id
    let main = document.querySelector("#main-list ul")
    main.innerHTML = ""
    fetch(MAIN_URL + `/decks/${id}`)
        .then(resp => resp.json())
        .then(deck => {
            for (const card of deck.cards) {
                renderQuestion(card);
            }
        })
}

function renderQuestion(card) {
    const cardInfo = document.querySelector("#main-list ul");
    cardInfo.innerHTML += `
    
    <div class = "card">  
    <h4>${card.question}</h4>
    <a href="#" data-id="${card.id}"><button data-id=${card.id} onclick="renderCardAnswer(${card.id})"; return false;>Get Answer</button></a>
    </div>
    
    `
    attachClickToCardLinks()
}

function attachClickToCardLinks() {
    let cards = document.querySelectorAll(" a")
    cards.forEach(card => {
        card.addEventListener('click', renderCardAnswer)
    })
}

function renderCardAnswer(event) {
    event.preventDefault()
    clearForm()
    let id = this.dataset.id
    let main = document.querySelector("#main-list ul")
    main.innerHTML = ""
    fetch(MAIN_URL + `/cards/${id}`)
        .then(resp => resp.json())
        .then(card => {
            main.innerHTML += `
            <div class = "card">
        
            <h3>${card.answer}</h3>
            </div>
            `
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
                attachClickToDeckLinks()
                clearForm()
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