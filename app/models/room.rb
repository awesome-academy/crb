class Room < ActiveRecord::Base
  has_many :schedules, dependent: :destroy

  validates :name, presence: true
  validates :name, uniqueness: true, length: {maximum: 150}
end
