class Schedule < ActiveRecord::Base
  belongs_to :user
  belongs_to :room
  has_many :schedule_users
  has_many :members, class_name: "Schedule", 
    through: :schedule_users,  foreign_key: :schedule_id

  validates :title, presence: true, length: {maximum: 150}
  validates :start_time, presence: true
  validates :finish_time, presence: true
  validates :description, presence: true, length: {maximum: 450}
  validates :room, presence: true
  validates :user, presence: true
  validate  :valid_room, :valid_time

  scope :today_schedule, -> {where("start_time LIKE ?", "#{Time.now.to_date.to_s}%")}
  scope :with_room, ->room {where("room_id = ?", room)}
  query = "(start_time <= :start_time AND finish_time >= :finish_time) 
          OR (start_time > :start_time AND start_time < :finish_time) 
          OR (finish_time > :start_time AND finish_time < :finish_time)"
  scope :filte_timer, ->(start, finish) {where(query, start_time: start, finish_time: finish)}

  private
  def valid_room
    if Schedule.with_room(room_id).filte_timer(start_time, finish_time).count > 0
      errors.add(:room_id, "There are any event with same your time!")
    end
  end

  def valid_time
    if start_time >= finish_time
      errors.add(:start_time, "Start time must be less than finish time!")
    end
  end
end