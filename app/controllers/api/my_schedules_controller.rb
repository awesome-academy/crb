class Api::MySchedulesController < ApplicationController
  def index
    @schedules = Schedule.my_schedule(current_user.id).order_start_time
                  .paginate page:params[:my_page], per_page: Settings.per_page

    if @show_more = @schedules.total_entries > Settings.number_of_schedules
      @schedules.total_entries = Settings.number_of_schedules
    end

    if params[:my_page]
      respond_to do |format|
        format.js
      end
    else
      render partial: "schedule", locals: {schedules: @schedules}
    end
  end
end
