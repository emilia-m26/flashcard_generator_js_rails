Rails.application.routes.draw do


  #nested route
  get '/decks/:id/cards', to:"cards#index", as:"deck_cards"


  resources :cards
  resources :decks
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  
  
end
