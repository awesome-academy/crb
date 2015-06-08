class PagesController < ApplicationController
  before_action :authenticate_user!
  def home
    @rooms = Room.pluck :name, :id
    @schedule = Schedule.new
  end
end
