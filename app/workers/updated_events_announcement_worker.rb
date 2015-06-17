class UpdatedEventsAnnouncementWorker
  include Sidekiq::Worker

  def perform member_ids, schedule_ids
    repeated = schedule_ids.length > 1
    schedules = Schedule.find schedule_ids
    schedule = schedules[0] unless repeated

    member_ids.each do |member_id|
      member = User.find member_id

      if repeated
        UserMailer.updated_repeat_event_announcement(member, schedules).deliver_now
      else
        UserMailer.updated_event_announcement(member, schedule).deliver_now
      end
    end
  end
end
