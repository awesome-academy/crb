class AnnounceWorker
  include Sidekiq::Worker

  def perform schedule_id
    schedule = Schedule.find_by id: schedule_id

    if schedule
      members = schedule.members.select :name, :email

      members.each do |member|
        UserMailer.upcoming_event_announcement(member, schedule).deliver_now
      end
    end
  end
end
