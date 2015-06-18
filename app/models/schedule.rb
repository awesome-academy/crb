class Schedule < ActiveRecord::Base
  include ScheduleJson
  include RailsAdminSchedule

  QUERY = "(start_time <= :start_time AND finish_time >= :finish_time)
            OR (start_time > :start_time AND start_time < :finish_time)
            OR (finish_time > :start_time AND finish_time < :finish_time)"

  belongs_to :repeat
  belongs_to :room
  belongs_to :user

  has_many :members, class_name: "User", through: :schedule_users, foreign_key: :schedule_id
  has_many :schedule_users
  
  validates :description, presence: true, length: {maximum: 450}
  validates :finish_time, presence: true
  validates :room, presence: true
  validates :start_time, presence: true
  validates :title, presence: true, length: {maximum: 150}
  validates :user, presence: true
  validate :valid_time, :valid_room

  after_create :announce_upcoming_event

  scope :with_room, ->(room, id){where(room: room).where.not id: id}
  scope :order_start_time, ->{order start_time: :asc}  
  scope :filte_timer, ->(start, finish){where(QUERY, start_time: start, finish_time: finish)}
  scope :today_schedule, ->{where("start_time LIKE ?", "%#{Time.now.to_date.to_s}%")}
  scope :filter_by_room, ->(room_id){where room_id: room_id if room_id.present? && room_id != "all"}
  scope :my_schedule, ->user_id{where(" ? <= start_time AND user_id = ?", Time.zone.now, user_id)}
  scope :shared_schedules_future, ->user_id{joins(:schedule_users)
                                      .where(" ? <= start_time AND schedule_users.user_id = ?", Time.zone.now, user_id)}
  scope :shared_schedules, ->user_id{joins(:schedule_users).where(" schedule_users.user_id = ?", user_id)}
  scope :filter_by_user, ->user_id{where(user: user_id)}
  scope :between_time, ->(start_date, end_date){where(" start_time BETWEEN ? AND ? ", start_date, end_date)}
  scope :shared_and_my_schedules, ->user_id{joins("LEFT JOIN schedule_users ON schedules.id = schedule_users.schedule_id")
                                      .where(" schedules.user_id = ? OR schedule_users.user_id = ?", user_id, user_id)}

  accepts_nested_attributes_for :members

  delegate :color, to: :room, prefix: true
  delegate :name, to: :room, prefix: true

  def self.search options, user_id
    start_date = options[:start_date].to_date
    end_date = options[:end_date].to_date
    if start_date.present? && end_date.present?
      @search = Schedule.shared_and_my_schedules(user_id).ransack options
      @schedules = @search.result.between_time start_date, end_date
    else
      @search = Schedule.shared_and_my_schedules(user_id).ransack options
      @schedules = @search.result
    end
  end

  def have_important_changes
    (Settings.important_atrributes & self.previous_changes.keys).present?
  end

  private
  def valid_room
    if Schedule.with_room(room_id, id).filte_timer(start_time, finish_time).count > 0
      errors.add :room, I18n.t("valid_room")
    end
  end

  def valid_time
    unless start_time.blank? || finish_time.blank?
      if start_time >= finish_time
        errors.add :start_time, I18n.t("invalid_start_time")
      end

      if (start_time.day != finish_time.day) || (finish_time - start_time < Settings.min_time_schedule)
        errors.add :finish_time, I18n.t("invalid_time")
      end

      if start_time.wday == Settings.validate_saturday || start_time.wday == Settings.validate_sunday
        errors.add :start_time, I18n.t("invalid_day")
      end

      if start_time < Time.zone.now
        errors.add :start_time, I18n.t("invalid_create_in_past")
      end
    end
  end

  def announce_upcoming_event
    now = Time.zone.now
    announced_at = start_time.ago announced_before
    AnnounceWorker.perform_at(announced_at, id) if now < announced_at
  end
end
