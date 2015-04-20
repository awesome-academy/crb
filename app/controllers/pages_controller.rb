class PagesController < ApplicationController
  def home
    @schedules = Schedule.today_schedule
  end

  def help
  end
end
