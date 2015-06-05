class Repeat < ActiveRecord::Base
  enum repeat_type: [:week, :month]

  has_many :schedules, dependent: :destroy
  belongs_to :user
end
