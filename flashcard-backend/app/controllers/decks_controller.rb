class DecksController < ApplicationController
  before_action :set_deck, only: [:show, :update, :destroy]
  #skip_before_action :verify_authenticity_token


  # GET /decks
  def index
    @decks = Deck.all

    render json: @decks
  end

  # GET /decks/1
  def show
    #deck = Deck.find_by(id: params[:id])
    render json: @deck
    
  end

  # POST /decks
  def create
    @deck = Deck.new(deck_params)
    #byebug
    if @deck.save
      render json: @deck, status: :created, location: @deck
    else
      render json: @deck.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /decks/1
  def update
    if @deck.update(deck_params)
      render json: @deck
    else
      render json: @deck.errors, status: :unprocessable_entity
    end
  end

  # DELETE /decks/1
  def destroy
    @deck.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_deck
      @deck = Deck.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def deck_params
      #params.require(:deck).permit(:name)
      params.require(:deck).permit(:name, cards_attributes:[:id, :card_front, :card_back, :deck_id, :category])
    end
end
