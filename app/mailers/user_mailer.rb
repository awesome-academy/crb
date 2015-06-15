class UserMailer < ApplicationMailer
  def invite_email member, schedule
    @member = member
    @schedule = schedule
    @subject = I18n.t "schedules.schedule_notice_mail"
    mail to: @member.email, subject: @subject
  end

  def invite_for_repeat_schedules member, schedules
    @member = member
    @schedules = schedules
    @subject = I18n.t "schedules.repeat_schedule_notice_mail"
    mail to: @member.email, subject: @subject
  end

  def upcoming_event_announcement user, schedule
    @user = user
    @schedule = schedule
    @subject = I18n.t "schedules.announce_upcoming_event"
    mail to: @user.email, subject: @subject
  end
end
