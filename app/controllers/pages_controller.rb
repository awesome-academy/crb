class PagesController < ApplicationController
  layout "fullcalendar"
  before_action :authenticate_user!

  def home
    @rooms = Room.pluck :name, :id
    @schedule = Schedule.new
    @schedule_days = Schedule.all.group_by{|schedule| schedule.start_time.beginning_of_day}
  end
end
