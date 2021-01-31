import { displayDeck } from './decks.js';

let main = document.querySelector("#deck-list");
let deckFormDiv = document.getElementById("deck-form");
let cardFormDiv = document.getElementById("card-form");

export function clearForm() {
    if (main.style.visibility === "visible") {
        deckFormDiv.innerHTML = ''
    } else {
        cardFormDiv.innerHTML = ''
    }
}

export function attachClickToDeckLinks() {
    //let decks = document.querySelectorAll("li a");
    let decks = document.querySelectorAll(".deck a");
    decks.forEach(deck => {
        deck.addEventListener('click', displayDeck)
    });
}