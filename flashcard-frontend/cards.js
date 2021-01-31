let cardFormDiv = document.getElementById("card-form");
let cardInfo = document.querySelector("#flashcard-list");


/* ALL FLASHCARD CODE */

function displayCreateCardForm() {
    let deckID = document.getElementById("deck_id").innerHTML;
    let html = `
        <form onsubmit="createFlashcard(); return false;">
        <label>Flashcard Front</label>
        <input type="text" id="card_front">
        <label>Flashcard Back</label>
        <input type="text" id="card_back">
        <label>Flashcard Category</label>
        <input type="text" id="category">
        <input type="hidden" id="deck_id" name="deck_id" value="${deckID}">
        <input type="submit" value="Create New FlashCard">    
    `
    cardFormDiv.innerHTML = html;
}

//post - create for flashcard
function createFlashcard() {
    const card = {
        card_front: document.getElementById("card_front").value,
        card_back: document.getElementById("card_back").value,
        deck_id: document.getElementById("deck_id").value,
        category: document.getElementById("category").value,
    }
    fetch(MAIN_URL + "/cards", {
            method: "POST",
            body: JSON.stringify(card),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
        .then(resp => resp.json())
        .then(card => {
            let cardInstance = new Card(card)
            document.querySelector("#flashcard-list").innerHTML += cardInstance.renderFlashcard();
        })
    clearForm();
}


//delete flashcard function
function removeCard(id) {
    //clearCardForm();
    if (confirm('Are you sure you want to delete the flashcard? This is irreversible.')) {
        fetch(MAIN_URL + `/cards/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            })
            .then(event.target.offsetParent.remove());
    }
}

function editCard(id) {
    //clearForm();
    fetch(MAIN_URL + `/cards/${id}`)
        .then(resp => resp.json())
        .then(card => {
            let html = `
            <form onsubmit="updateCard(${id});return false;">
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
            document.querySelectorAll(`.flipCard .buttons button[data-id="${card.id}"]`)[0].parentElement.parentElement.innerHTML = `
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
                `
            clearForm();
        })
}