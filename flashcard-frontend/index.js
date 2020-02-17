const MAIN_URL = "http://localhost:3000"

window.addEventListener('load', () => {
    getDecks()
    attachClickToDeckLinks()
    displayCreateForm()
})

function getDecks() {
    clearForm()
    let main = document.querySelector("#main-list ul")
    fetch(MAIN_URL + "/decks")
        .then(resp => resp.json())
        .then(decks => {
            main.innerHTML += decks.map(deck => `<li><a href="#" data-id="${deck.id}">${deck.name} - (${deck.cards.length})</a>
            <button data-id=${deck.id} onclick="editDeck(${deck.id})"; return false;>Edit</button>
            <button data-id=${deck.id} onclick="removeDeck(${deck.id})"; return false;>Delete</button>
            </li>`).join('')
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
            document.querySelector("#main-list ul").innerHTML += `
            <li><a href="#" data-id="${deck.id}">${deck.name} - (${deck.cards.length})</a>
            <button data-id=${deck.id} onclick="editDeck(${deck.id})"; return false;>Edit</button>
            <button data-id=${deck.id} onclick="removeDeck(${deck.id})"; return false;>Delete</button></li>
            
            `
            clearForm()
        })

}

//show view
function displayDeck(event) {
    event.preventDefault()
    clearForm()
    let id = this.dataset.id
    let main = document.querySelector("#main-list ul")
    main.innerHTML = ""
    fetch(MAIN_URL + `/decks/${id}`)
        .then(resp => resp.json())
        .then(deck => {
            main.innerHTML += `
        <h3>${deck.name}</h3><hr>
        <h4>All cards of specific deck will show here - Questions only</h4>
        `
        })


}