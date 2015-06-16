class MembersInvitationWorker
  include Sidekiq::Worker

  def perform added_member_ids, schedule_ids
    repeated = schedule_ids.length > 1
    schedules = Schedule.find schedule_ids
    schedule = schedules[0] unless repeated

    added_member_ids.each do |member_id|
      member = User.find member_id

      if repeated
        UserMailer.invite_for_repeat_schedules(member, schedules).deliver_now
      else
        UserMailer.invite_email(member, schedule).deliver_now
      end
    end
  end
end
