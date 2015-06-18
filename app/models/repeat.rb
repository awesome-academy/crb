class Repeat < ActiveRecord::Base
  include RailsAdminRepeat

  enum repeat_type: [:week, :month]

  belongs_to :user

  has_many :schedules, dependent: :destroy
end
