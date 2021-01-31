// window.addEventListener('load', () => {
//     //getDecks();    
// })

//OOJS
export class Deck {
    constructor(deck) {
        this.id = deck.id
        this.name = deck.name
    }
    renderDeck() {
        return `
        <div class="deck">
        <img src="images/lightbulb.jpg" alt="Avatar" style="width:100%">
        <div class="container">
        <a href="#" data-id="${this.id}">${this.name}</a>
        <p>
        <button data-id=${this.id} onclick="editDeck(${this.id})"; return false;>Edit</button>
        <button data-id=${this.id} onclick="removeDeck(${this.id})"; return false;>Delete</button>
        </p>
        </div>
        </div>
        `
    }

}

export class Card {
    constructor(card) {
        this.id = card.id
        this.card_front = card.card_front
        this.card_back = card.card_back
        this.category = card.category
        this.deck_id = card.deck_id
    }
    renderFlashcard() {
        return `
        <div class="flipCard">
        <div class="card" onclick="this.classList.toggle('flipped');">
            <div class="side front">${this.card_front}</div>
            <div class="side back">${this.card_back}</div>
            <div id="deck_id" data-id="${this.deck_id}" style="visibility: hidden;">${this.deck_id}</div>
        </div>
        <br>
        <div class=buttons>
            <button data-id=${this.id} onclick="editCard(${this.id})"; return false;>Edit</button>
            <button data-id=${this.id} onclick="removeCard(${this.id})"; return false;>Delete</button>
        </div>
    </div>
    <br>
    `
    }
}