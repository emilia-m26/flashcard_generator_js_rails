# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)


Deck.create(name: "Psychology") #deck 1
Deck.create(name: "HTML") #deck 2
Deck.create(name: "Javascript") #deck 3

Card.create(deck_id: 1, question: "What is Psychology?", answer: "Psychology is the scientific study of the mind and behavior.")
Card.create(deck_id: 1, question: "What are the different types of Psychology?", answer: "Cognitive, Forensic, Social, and Developmental Psychology.")
Card.create(deck_id: 1, question: "Who is the father of Psychology?", answer: "Wilhelm Wundt is often referred to as the father of Psychology.")

Card.create(deck_id: 2, question: "What does HTML stand for?", answer: "HTML stands for Hypertext Markup Language.")
Card.create(deck_id: 2, question: "Is HTML considered a programming language?", answer: "No, HTML is not a programming language.")

Card.create(deck_id: 3, question: "What is Javascript?", answer: "JavaScript is a dynamic computer programming language.")
Card.create(deck_id: 3, question: "What is Javascript used for?", answer: "In most cases, JavaScript is used to create responsive, interactive elements for web pages, enhancing the user experience.")
Card.create(deck_id: 3, question: "Name a Javascript library.", answer: "jQuery is a Javascript library.")
Card.create(deck_id: 3, question: "Name a Javascript framework.", answer: "React is a Javascript library.")
