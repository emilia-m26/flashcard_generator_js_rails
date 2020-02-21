function displayCreateCardForm() {
    let deckFormDiv = document.getElementById("deck-form")
    let html = `
        <form onsubmit="createCard(); return false;">

        <label>Question</label>
        <input type="text" id="question">

       
        <label>Answer</label>
        <input type="text" id="answer"></p>


        
        <input type="submit" value="Create New Deck">    
    `
    deckFormDiv.innerHTML = html
}


function createCard(id) {
    const card = {
        question: document.getElementById("question").value,
        answer: document.getElementById("answer").value,
        deck_id: deck.id
    }

}
fetch(MAIN_URL + `/decks/${id}`, {
        method: "POST",
        body: JSON.stringify(card),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
    .then(resp => resp.json())
    .then(card => {
        document.querySelector("#main-list ul").innerHTML += ` 
        <li> 
        <a href="#" data-id = "${deck.id}"> $ {deck.name } - ($ { deck.cards.length }) < /a> <
        button data - id = $ { deck.id }
        onclick = "editDeck(${deck.id})";
        return false; > Edit < /button> <
        button data - id = $ { deck.id }
        onclick = "removeDeck(${deck.id})";
        return false; > Delete < /button></li >
        `
        attachClickToDeckLinks()
        clearForm()
    })
}