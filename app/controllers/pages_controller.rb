class PagesController < ApplicationController
  def home
    @schedules = Schedule.today_schedule
    @schedule = Schedule.new
  end

  def help
  end
end
