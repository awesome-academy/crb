class PagesController < ApplicationController
  def home
    @rooms = Room.select(:id, :name).collect {|r| [r.name, r.id]}
    @schedule = Schedule.new
    @schedule_days = Schedule.all.group_by{|t| t.start_time.beginning_of_day}
  end
end
