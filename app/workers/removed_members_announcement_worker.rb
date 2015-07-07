class RemovedMembersAnnouncementWorker
  include Sidekiq::Worker

  def perform removed_member_ids = [], schedule_ids = []
    schedules = Schedule.with_ids schedule_ids

    if schedules.present?
      repeated = schedule_ids.length > 1
      schedule = schedules[0] unless repeated
      members = User.select(:id, :name, :email).with_ids removed_member_ids

      members.each do |member|
        if repeated
          UserMailer.removed_from_repeat_events_announcement(member, schedules).deliver_now
        else
          UserMailer.removed_from_event_announcement(member, schedule).deliver_now
          WebsocketRails.users[member.id].send_message Settings.removed, schedule.id
        end
      end
    end
  end
end
