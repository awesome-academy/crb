class UpdatedEventAnnouncementWorker
  include Sidekiq::Worker

  def perform schedule_id
    schedule = Schedule.find schedule_id
    receivers = schedule.members + [schedule.user]

    receivers.each do |receiver|
      UserMailer.updated_event_announcement(receiver, schedule).deliver_now
    end
  end
end
