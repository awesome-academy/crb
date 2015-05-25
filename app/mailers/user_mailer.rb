class UserMailer < ApplicationMailer
  def invite_email member, schedule
    @member = member
    @schedule = schedule
    mail to: @member.email, subject: 'Welcome to Conference Book Room'
  end
end
