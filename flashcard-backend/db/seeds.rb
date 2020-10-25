# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)


Deck.create(name: "Hawaiian") #deck 1
Deck.create(name: "Portuguese") #deck 2
Deck.create(name: "Spanish") #deck 3

Card.create(deck_id: 1, card_front: "'Ohana", card_back: "Family", category: "Family")
Card.create(deck_id: 1, card_front: "Makuahine", card_back: "Mother", category: "Family")
Card.create(deck_id: 1, card_front: "Makuakāne", card_back: "Father", category: "Family")
Card.create(deck_id: 1, card_front: "Aloha", card_back: "Hello", category: "Intro")
Card.create(deck_id: 1, card_front: "Aloha", card_back: "Farewell", category: "Intro")

Card.create(deck_id: 2, card_front: "Família", card_back: "Family", category: "Family")
Card.create(deck_id: 2, card_front: "Mãe", card_back: "Mother", category: "Family")
Card.create(deck_id: 2, card_front: "Pai", card_back: "Father", category: "Family")
Card.create(deck_id: 2, card_front: "Olá", card_back: "Hello", category: "Intro")
Card.create(deck_id: 2, card_front: "Tchau", card_back: "Bye", category: "Intro")

Card.create(deck_id: 3, card_front: "Familia", card_back: "Family", category: "Family")
Card.create(deck_id: 3, card_front: "Mamá", card_back: "Mother", category: "Family")
Card.create(deck_id: 3, card_front: "Papá", card_back: "Father", category: "Family")
Card.create(deck_id: 3, card_front: "Hola", card_back: "Hello", category: "Intro")
Card.create(deck_id: 3, card_front: "Adiós", card_back: "Bye", category: "Intro")



