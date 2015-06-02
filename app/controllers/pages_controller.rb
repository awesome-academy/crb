class PagesController < ApplicationController
  before_action :authenticate_user!
  def home
    @rooms = Room.select(:id, :name).collect {|r| [r.name, r.id]}
    @schedule = Schedule.new
  end
end
