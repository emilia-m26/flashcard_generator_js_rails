const MAIN_URL = "http://localhost:3000"

function getDecks() {
    clearForm()
    let main = document.querySelector("#main-list ul")
    fetch(MAIN_URL + "/decks")
        .then(resp => resp.json())
        .then(decks => {
            main.innerHTML += decks.map(deck => `<li><a href="#" data-id="${deck.id}">${deck.name} - (${deck.cards.length})</a></li>`).join('')
            attachClickToDeckLinks()
        })
}

function clearForm() {
    let deckFormDivList = document.getElementById("deck-form-list")
    deckFormDivList.innerHTML = ''
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
        <label>Name</label>
        <input type="text" id="name">
        <input type="submit" value="Create New Deck">
    `
    deckFormDiv.innerHTML = html
}

function createDeck() {
    const deck = {
        name: document.getElementById("name").value
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
            document.querySelector("#main-list").innerHTML += `
            <li>${deck.name} - (${deck.cards.length})</li>
            `
        })
}


function displayDeck(event) {
    event.preventDefault()
    clearForm()

}

window.addEventListener('load', () => {
    getDecks()
    attachClickToDeckLinks()
    displayCreateForm()
})