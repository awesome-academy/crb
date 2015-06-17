class EditRepeatWorker
  include Sidekiq::Worker

  def perform added_member_ids, removed_member_ids, schedule_id, announce
    schedule_sample = Schedule.find schedule_id
    repeat = Repeat.find schedule_sample.repeat_id
    schedules = repeat.schedules
    repeated_schedule_ids = Array.new
    shared_member_ids = schedule_sample.member_ids - added_member_ids
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

    UpdatedEventsAnnouncementWorker.perform_async(shared_member_ids, repeated_schedule_ids) if announce
    MembersInvitationWorker.perform_async added_member_ids, repeated_schedule_ids
    RemovedMembersAnnouncementWorker.perform_async removed_member_ids, repeated_schedule_ids
  end
end
