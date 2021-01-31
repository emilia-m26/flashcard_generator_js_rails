import { clearForm, attachClickToDeckLinks } from './utils.js';
import { Deck } from './classes.js';

let main = document.querySelector("#deck-list");
let deckFormDiv = document.getElementById("deck-form");
const MAIN_URL = "http://localhost:3000";
let cardInfo = document.querySelector("#flashcard-list");


window.addEventListener('load', () => {
    //getDecks();
    let startButton = document.querySelector('#starter');
    startButton.addEventListener('click', getDecks);
})

//get - index
function getDecks() {
    clearForm();
    let banner = document.querySelector("#banner");
    banner.remove();
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

function displayForms() {
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
            document.querySelector("#deck-list").innerHTML += deckInstance.renderDeck();
            attachClickToDeckLinks();
            clearForm();
        })
}


//get - show route - pulling info for displaying flashcards
export function displayDeck(event) {
    event.preventDefault();
    clearForm();
    let id = this.dataset.id;
    main.style = "visibility: hidden;"
    main.innerHTML = '';
    displayForms();
    fetch(MAIN_URL + `/decks/${id}`)
        .then(resp => resp.json())
        .then(deck => {
            if (deck.cards.length === 0) {
                renderFlashcardNoCards(deck.id)
            } else {
                for (const card of deck.cards) {
                    renderFlashcard(card);
                }
            }
        })
}

function renderFlashcardNoCards(id) {
    cardInfo.innerHTML += `
    <div id="deck_id" value="${id}" style="visibility: hidden;">${id}</div>
    `
}

function renderFlashcard(card) {
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
    if (confirm('Are you sure you want to delete the deck? This is irreversible.')) {
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
            document.querySelectorAll(`#deck-list a[data-id="${id}"]`)[0].parentElement.innerHTML = `
           
            <a href="#" data-id="${deck.id}">${deck.name}</a>
            <p>
            <button data-id=${deck.id} onclick="editDeck(${deck.id})"; return false;>Edit</button>
            <button data-id=${deck.id} onclick="removeDeck(${deck.id})"; return false;>Delete</button>
            </p>
            
            `
            attachClickToDeckLinks();
            clearForm();
        })
}