class Room < ActiveRecord::Base
  has_many :schedules, dependent: :destroy

  validates :name, presence: true, uniqueness: true, length: {maximum: 150}
end