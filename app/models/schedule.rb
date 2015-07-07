class Schedule < ActiveRecord::Base
  include ScheduleJson
  include RailsAdminSchedule
  require "sidekiq/api"

  QUERY = "(start_time <= :start_time AND finish_time >= :finish_time)
            OR (start_time > :start_time AND start_time < :finish_time)
            OR (finish_time > :start_time AND finish_time < :finish_time)"

  belongs_to :repeat
  belongs_to :room
  belongs_to :user

  has_many :members, class_name: "User", through: :schedule_users, foreign_key: :schedule_id
  has_many :schedule_users

  validates :finish_time, presence: true
  validates :start_time, presence: true
  validates :title, presence: true,
    length: {maximum: Settings.schedule.title.maximum}
  validates :user, presence: true
  validate :valid_time
  validate :valid_room, if: :room_id

  scope :with_room, ->(room, id){where(room: room).where.not id: id}
  scope :order_start_time, ->{order start_time: :asc}
  scope :filte_timer, ->(start, finish){where(QUERY, start_time: start, finish_time: finish)}
  scope :today_schedule, ->{where("start_time LIKE ?", "%#{Time.now.to_date.to_s}%")}
  scope :filter_by_room, ->(room_id){where room_id: room_id if room_id.present? && room_id != "all"}
  scope :my_schedule, ->user_id{where(" ? <= finish_time AND user_id = ?", Time.zone.now, user_id)}
  scope :shared_schedules_future, ->user_id{joins(:schedule_users)
                                      .where(" ? <= finish_time AND schedule_users.user_id = ?", Time.zone.now, user_id)}
  scope :shared_schedules, ->user_id{joins(:schedule_users).where(" schedule_users.user_id = ?", user_id)}
  scope :filter_by_user, ->user_id{where(user: user_id)}
  scope :search_by_time, ->(_start, _end) do
    if _start.present? && _end.present?
      where(" start_time BETWEEN ? AND ? ", _start, _end)
    elsif _start.present? && !_end.present?
      where(" start_time > ?", _start)
    elsif !_start.present? && _end.present?
      where(" start_time < ?", _end)
    end
  end
  scope :shared_and_my_schedules, ->user_id{joins("LEFT JOIN schedule_users ON schedules.id = schedule_users.schedule_id")
                                      .where(" schedules.user_id = ? OR schedule_users.user_id = ?", user_id, user_id)}
  scope :filter_by_repeat, ->repeat_id{where repeat: repeat_id}
  scope :with_ids, ->ids{where id: ids}

  delegate :color, :name, to: :room, prefix: true, allow_nil: true

  after_commit :announce_upcoming_event, on: :create, if: :announced_before
  after_commit :announce_event_after_update, on: :update, if: :announced_before
  after_commit :delete_job, on: :destroy

  def self.search options = {}, user_id
    _start, _end = options[:start_date].to_date, options[:end_date].to_date
    _room = options[:room_id]
    search = Schedule.shared_and_my_schedules(user_id).ransack options

    search.result.search_by_time(_start, _end).filter_by_room(_room).uniq
  end

  def have_important_changes
    (Settings.important_atrributes & self.previous_changes.keys).present?
  end

  private
  def valid_room
    if Schedule.with_room(room_id, id).filte_timer(start_time, finish_time).count > 0
      errors.add :room, I18n.t("valid.room")
    end
  end

  def valid_time
    unless start_time.blank? || finish_time.blank?
      errors.add :base, I18n.t("invalid.create_in_past") if start_time < Time.zone.now
      errors.add :base, I18n.t("invalid.between_time") if !cover_in_time?
      errors.add :base, I18n.t("invalid.time") if valid_min_time_range?
    end
  end

  def announce_upcoming_event
    announced_at = start_time.ago announced_before
    AnnounceWorker.perform_at(announced_at, id) if Time.zone.now < announced_at
  end

  def delete_job
    jobs = Sidekiq::ScheduledSet.new
    jobs.each{|job| job.delete if job.klass == "AnnounceWorker" && job.args[0] == id}
  end

  def announce_event_after_update
    delete_job
    announce_upcoming_event
  end

  def time_range
    beginning_of_day = start_time.change({hour: Settings.schedule.hour_begin, minute: 0})
    end_of_day = start_time.change({hour: Settings.schedule.hour_end, minute: 0})
    (beginning_of_day..end_of_day)
  end

  def cover_in_time?
    time_range.cover?(start_time) && time_range.cover?(finish_time)
  end

  def valid_min_time_range?
    (finish_time - start_time) < Settings.schedule.min_time
  end
end
