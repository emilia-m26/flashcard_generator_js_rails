Rails.application.routes.draw do


  #nested indez
  #get '/decks/:deck_id/cards', to:"cards#index", as:"deck_cards"
  #nested
  #post '/decks/:deck_id/cards', to:"cards#create"


  resources :cards
  resources :decks
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  
  
end
