class AnnounceWorker
  include Sidekiq::Worker

  def perform schedule_id
    schedule = Schedule.find_by id: schedule_id

    if schedule
      members = schedule.members.select :id, :name, :email

      members.each do |member|
        UserMailer.upcoming_event_announcement(member, schedule).deliver_now
        WebsocketRails.users[member.id].send_message Settings.announced_upcoming, schedule_id
      end
    end
  end
end
