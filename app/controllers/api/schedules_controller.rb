class Api::SchedulesController < ApplicationController
  load_and_authorize_resource

  def index
    schedules = Schedule.filter_by_room params[:room_id]

    respond_to do |format|
      format.json {render json: {schedules: schedules.map(&:min_json)}, status: :ok}
    end
  end
end
