class CardSerializer < ActiveModel::Serializer
  attributes :id, :card_front, :card_back, :deck_id, :category

  belongs_to :deck 
end
