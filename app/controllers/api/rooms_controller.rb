class Api::RoomsController < ApplicationController
  def index
    respond_to do |format|
      format.json {render json: {free_rooms: free_rooms}, status: :ok}
    end
  end

  private
  def free_rooms
    Room.free_rooms_in_range(params[:start_time], params[:finish_time]).select(:id)
  end
end
