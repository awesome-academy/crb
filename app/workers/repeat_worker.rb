class RepeatWorker
  include Sidekiq::Worker

  def perform schedule_id, repeat_type, current_user_id
    repeat = Repeat.create repeat_type: repeat_type, user_id: current_user_id

    schedule = Schedule.find schedule_id
    schedule.update_attributes repeat_id: repeat.id

    number_of_schedules = schedule.start_time.send("end_of_#{repeat_type}").day -
      schedule.start_time.day
    start_time, finish_time = schedule.start_time, schedule.finish_time

    number_of_schedules.times do |num|
      @new_schedule = schedule.deep_clone include: :schedule_users
      @new_schedule.start_time = start_time + (num + 1).days
      @new_schedule.finish_time = finish_time + (num + 1).days

      @new_schedule.save if @new_schedule.valid?
    end
  end
end
