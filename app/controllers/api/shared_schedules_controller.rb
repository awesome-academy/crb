class Api::SharedSchedulesController < ApplicationController
  def index
    @schedules = Schedule.shared_schedules_future(current_user.id).order_start_time
                  .paginate page:params[:shared_page], per_page: Settings.per_page

    @show_more = @schedules.total_entries > Settings.number_of_schedules
    @schedules.total_entries = Settings.number_of_schedules if @show_more

    if params[:shared_page]
      respond_to do |format|
        format.js
      end
    else
      render partial: "schedule", locals: {schedules: @schedules}
    end
  end
end
