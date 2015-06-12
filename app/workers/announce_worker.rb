class AnnounceWorker
  include Sidekiq::Worker

  def perform schedule_id
    schedule = Schedule.find schedule_id
    receivers = schedule.members
    receivers << schedule.user

    receivers.each do |receiver|
      UserMailer.upcoming_event_announcement(receiver, schedule).deliver_now
    end
  end
end
