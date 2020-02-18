Rails.application.routes.draw do
  resources :cards
  resources :decks
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  #nested route
  #get '/decks/:deck_id/cards', to:"cards#index", as:"deck_cards"
end
