class UserMailer < ApplicationMailer
  def invite_email member, schedule
    @member = member
    @schedule = schedule
    mail to: @member.email, subject: 'Welcome to Conference Book Room'
  end

  def upcoming_event_announcement user, schedule
    @user = user
    @schedule = schedule
    @subject = I18n.t "schedules.announce_upcoming_event"
    mail to: @user.email, subject: @subject
  end
end
