const MAIN_URL = "http://localhost:3000"

window.addEventListener('load', () => {
    getDecks()
    attachClickToDeckLinks()
        //displayCreateForm()
})

function getDecks() {
    clearForm()
    let main = document.querySelector("#main-list ul")
    fetch(MAIN_URL + "/decks")
        .then(resp => resp.json())
        .then(decks => {
            main.innerHTML += decks.map(deck => `<li><a href="#" data-id="${deck.id}">${deck.name} - (${deck.cards.length})</a>
            <button data-id=${deck.id} onclick="editDeck(${deck.id})"; return false;>Edit</button>
            <button data-id=${deck.id} onclick="removeDeck(${deck.id})"; return false;>Delete</button></li>`).join('')
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
        <input type="text" id="question">
        <label>Answer</label>
        <input type="text" id="answer"></p>

        <p><label>Question</label>
        <input type="text" id="question">
        <label>Answer</label>
        <input type="text" id="answer"></p>

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
            // for (const element of deck.cards) {
            //     console.log(element.question);
            // }
            //     main.innerHTML += `
            //     <hr>
            //     <h4>${deck.name}</h4>
            //     <h5>${deck.cards[0].question} - (${deck.cards[0].answer}) </h5>
            //     <h5>${deck.cards[1].question} - (${deck.cards[1].answer}) </h5>
            //     <button data-id=${deck.id} onclick="getCardAnswer(${deck.id})"; return false;>Get Answer</button></li>
            // `
            // })
        })
}

//have button go to answer for specific question OR make question a link to the answer
function renderQuestion(card) {
    const cardInfo = document.querySelector("#main-list ul");
    cardInfo.innerHTML += `
    <li><a href="#" data-id="${card.id}"><h4>${card.question}</h4></a>
    <button data-id=${card.id} onclick="renderCardAnswer(${card.id})"; return false;>Get Answer</button>
    </li>
    `
    attachClickToCardLinks()
}

function attachClickToCardLinks() {
    let cards = document.querySelectorAll("li a")
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
    fetch(MAIN_URL + `/decks/${id}`)
        .then(resp => resp.json())
        .then(deck => {
            for (const card of deck.cards) {
                renderQuestion(card);
            }

        })
}




//delete route
function removeDeck(id) {
    clearForm()
        //need to hand config object
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
        .then((deck) => {
                document.querySelectorAll(`li a[data-id="${id}"]`)[0].parentElement.innerHTML = `
                <a href="#" data-id="${deck.id}">${deck.name} - (${deck.cards.length})</a>
                <button data-id=${deck.id} onclick="editDeck(${deck.id})"; return false;>Edit</button>
                <button data-id=${deck.id} onclick="removeDeck(${deck.id})"; return false;>Delete</button>
                
                `
                attachClickToDeckLinks()
                clearForm()
            }

        )
}