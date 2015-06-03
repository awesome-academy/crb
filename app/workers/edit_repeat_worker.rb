class EditRepeatWorker
  include Sidekiq::Worker

  def perform schedule_id
    schedule_sample = Schedule.find schedule_id
    repeat = Repeat.find schedule_sample.repeat_id
    schedules = repeat.schedules

    schedules.each do |schedule|
      day = schedule.start_time.day
      schedule.start_time = schedule_sample.start_time.change day: day
      schedule.finish_time = schedule_sample.finish_time.change day: day

      schedule.attributes = schedule_sample.attributes.except "id", "start_time", "finish_time"
      schedule.save if schedule.valid?
    end
  end
end
