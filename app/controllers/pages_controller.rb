class PagesController < ApplicationController
  def home
    @rooms = Room.select(:id, :name).collect {|r| [r.name, r.id]}
    @schedule = Schedule.new
  end
end
