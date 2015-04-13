class PagesController < ApplicationController
  def home
    @feed_items = Schedule.today_schedule
  end

  def help
  end
end
