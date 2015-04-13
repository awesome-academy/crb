class Schedule < ActiveRecord::Base
  belongs_to :user
  belongs_to :room

  validates :event, presence: true, length: {maximum: 150}
  validates :date, presence: true
  validates :start_time, presence: true
  validates :finish_time, presence: true
  validates :room, presence: true
  validates :user, presence: true
end