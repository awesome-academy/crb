class EditRepeatWorker
  include Sidekiq::Worker

  def perform schedule_id, announce
    schedule_sample = Schedule.find schedule_id
    repeat = Repeat.find schedule_sample.repeat_id
    schedules = repeat.schedules

    schedules.each do |schedule|
      day = schedule.start_time.day
      schedule.start_time = schedule_sample.start_time.change day: day
      schedule.finish_time = schedule_sample.finish_time.change day: day

      schedule.attributes = schedule_sample.attributes.except "id", "start_time", "finish_time"
      schedule.members = schedule_sample.members
      schedule.save if schedule.valid?
    end
    if announce
      members = schedule_sample.members
      members.each {|member| UserMailer.updated_repeat_event_announcement(member, schedules).deliver_now}
    end
  end
end
