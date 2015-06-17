class PagesController < ApplicationController
  layout "fullcalendar"
  before_action :authenticate_user!

  def home
    @rooms = Room.select :id, :name, :color
    @schedule = Schedule.new
  end
end
