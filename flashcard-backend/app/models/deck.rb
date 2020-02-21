class Deck < ApplicationRecord
    has_many :cards, :dependent => :destroy

    accepts_nested_attributes_for :cards
    
    validates :name, presence: true

end
