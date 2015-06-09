class PagesController < ApplicationController
  layout "fullcalendar"
  before_action :authenticate_user!

  def home
    @rooms = Room.pluck :name, :id
    @schedule = Schedule.new
  end
end
