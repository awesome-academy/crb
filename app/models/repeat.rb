class Repeat < ActiveRecord::Base
  include RailsAdminRepeat

  enum repeat_type: [:week, :month]

  has_many :schedules, dependent: :destroy
  belongs_to :user
end
