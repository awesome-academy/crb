class EditRepeatWorker
  include Sidekiq::Worker

  def perform added_member_ids, schedule_id, announce
    schedule_sample = Schedule.find schedule_id
    repeat = Repeat.find schedule_sample.repeat_id
    schedules = repeat.schedules
    repeated_schedule_ids = Array.new

    schedules.each do |schedule|
      day = schedule.start_time.day
      schedule.start_time = schedule_sample.start_time.change day: day
      schedule.finish_time = schedule_sample.finish_time.change day: day

      schedule.attributes = schedule_sample.attributes.except "id", "start_time", "finish_time"
      schedule.members = schedule_sample.members

      if schedule.valid?
        schedule.save
        repeated_schedule_ids << schedule.id
      end
    end

    if announce
      members = schedule_sample.members
      members.each {|member| UserMailer.updated_repeat_event_announcement(member, schedules).deliver_now}
    end

    MembersInvitationWorker.perform_async added_member_ids, repeated_schedule_ids
  end
end
