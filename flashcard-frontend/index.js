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
            <input type="text" id="card[question]">
            <label>Answer</label>
            <input type="text" id="card[answer]"></p>

            <p><label>Question</label>
                <input type="text" id="card[question]">
                <label>Answer</label>
                <input type="text" id="card[answer]"></p>
    
        <input type="submit" value="Create New Deck">
       
    `
        //<input type="hidden" id="deck_id" name="deck_id" value=${deck.id}>

    deckFormDiv.innerHTML = html


}


function createDeck() {
    const deck = {
        name: document.getElementById("name").value,
        cards: [{
            question: document.getElementById("card[question]").value,
            answer: document.getElementById("card[answer]").value,
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

//have button go to answer for specific question OR make question a link to the answer
function renderQuestion(card) {
    const cardInfo = document.querySelector("#main-list ul");
    cardInfo.innerHTML += `
    <li>
    <a href="#" data-id="${card.id}"><h4>${card.question}</h4></a>
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
    fetch(MAIN_URL + `/cards/${id}`)
        .then(resp => resp.json())
        .then(card => {
            // for (const card of cards) {
            //     renderAnswer(card);
            //space
            // card.find(function(element) {
            //     return element.answer;

            // for (const element in card) {
            //     console.log(card.answer);
            main.innerHTML += `
            <h3>${card.answer}</h3>
            `
        })
}


// //shows all - need it to show one specific answer
// function renderAnswer(card) {
//     const cardInfo = document.querySelector("#main-list ul");
//     cardInfo.innerHTML += `
//         <li>
//         <h4>${card.answer}</h4>
//         </li>
//     `
// }


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