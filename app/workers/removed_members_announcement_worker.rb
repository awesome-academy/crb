class RemovedMembersAnnouncementWorker
  include Sidekiq::Worker

  def perform removed_member_ids, schedule_ids
    repeated = schedule_ids.length > 1
    schedules = Schedule.find schedule_ids
    schedule = schedules[0] unless repeated

    removed_member_ids.each do |member_id|
      member = User.find member_id

      if repeated
        UserMailer.removed_from_repeat_events_announcement(member, schedules).deliver_now
      else
        UserMailer.removed_from_event_announcement(member, schedule).deliver_now
      end
    end
  end
end
