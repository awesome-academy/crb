class Schedule < ActiveRecord::Base
  belongs_to :user
  belongs_to :room
  has_many :schedule_users
  has_many :members, class_name: "Schedule", through: :schedule_users,  foreign_key: :schedule_id

  validates :title, presence: true, length: {maximum: 150}
  validates :start_time, presence: true
  validates :finish_time, presence: true
  validates :description, presence: true, length: {maximum: 450}
  validates :room, presence: true
  validates :user, presence: true

  scope :today_schedule, -> {where("start_time LIKE ?", "%#{Time.now.to_date.to_s}%")}
end
