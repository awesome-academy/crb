class MembersInvitationWorker
  include Sidekiq::Worker

  def perform added_member_ids = [], schedule_ids = []
    schedules = Schedule.with_ids schedule_ids

    if schedules.present?
      repeated = schedule_ids.length > 1
      schedule = schedules[0] unless repeated
      members = User.select(:name, :email).with_ids added_member_ids

      members.each do |member|
        if repeated
          UserMailer.invite_for_repeat_schedules(member, schedules).deliver_now
        else
          UserMailer.invite_email(member, schedule).deliver_now
        end
      end
    end
  end
end
