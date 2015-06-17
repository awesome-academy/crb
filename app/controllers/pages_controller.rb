class PagesController < ApplicationController
  layout "fullcalendar"
  before_action :authenticate_user!

  def home
    @rooms = Room.select :id, :name, :color
    @schedule = Schedule.new
    @schedule_days = Schedule.all.group_by{|schedule| schedule.start_time.beginning_of_day}
  end
end
