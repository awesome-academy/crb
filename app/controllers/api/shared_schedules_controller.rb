class Api::SharedSchedulesController < ApplicationController
  def index
    @schedules = Schedule.shared_schedules_future(current_user.id).order_start_time
                  .page(params[:shared_page]).per Settings.per_page

    @show_more = @schedules.total_count > Settings.number_of_schedules

    if params[:shared_page]
      respond_to do |format|
        format.js
      end
    else
      render partial: "schedule", locals: {schedules: @schedules}
    end
  end
end
