class Api::SharedSchedulesController < ApplicationController
  def index
    @schedules = Schedule.shared_schedule(current_user.id)
                  .page(params[:shared_page]).per_page(Settings.per_page).order_start_time

    if params[:shared_page]
      respond_to do |format|
        format.js
      end
    else
      render partial: "schedule", locals: {schedules: @schedules}
    end
  end
end
