class PagesController < ApplicationController
  def home
    @today_schedules = Schedule.today_schedule
    @schedule = Schedule.new
  end
end