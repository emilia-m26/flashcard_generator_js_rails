const MAIN_URL = "http://localhost:3000"

function getDecks() {
    clearForm()
    let main = document.getElementById("main")
    main.innerHTML = "<ul>"
    fetch(MAIN_URL + "/decks")
        .then(resp => resp.json())
        .then(decks => {
            main.innerHTML += decks.map(deck => `<li><a href="#" data-id="${deck.id}">${deck.name} - ${deck.count}</a></li>`).join('')
            main.innerHTML += "</ul>"
            attachClickToDeckLinks()
        })


}

function clearForm() {
    let deckFormDiv = document.getElementById(deck - form)
    deckFormDiv.innerHTML = ''
}

function attachClickToDeckLinks() {
    let decks = document.querySelectorAll("li a")
    decks.forEach(deck => {
        deck.addEventListener('click', displayDeck)
    })
}

function displayDeck()