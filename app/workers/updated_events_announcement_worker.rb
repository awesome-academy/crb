class UpdatedEventsAnnouncementWorker
  include Sidekiq::Worker

  def perform member_ids = [], schedule_ids = []
    schedules = Schedule.with_ids schedule_ids

    if schedules.present?
      repeated = schedule_ids.length > 1
      schedule = schedules[0] unless repeated
      members = User.select(:id, :name, :email).with_ids member_ids

      members.each do |member|
        if repeated
          UserMailer.updated_repeat_event_announcement(member, schedules).deliver_now
        else
          UserMailer.updated_event_announcement(member, schedule).deliver_now
          WebsocketRails.users[member.id].send_message Settings.announced_updated, schedule.id
        end
      end
    end
  end
end
