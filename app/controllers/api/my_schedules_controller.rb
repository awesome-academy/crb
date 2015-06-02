class Api::MySchedulesController < ApplicationController
  def index
    @schedules = Schedule.my_schedule(current_user.id)
                  .page(params[:my_page]).per_page(Settings.per_page).order_start_time

    if params[:my_page]
      respond_to do |format|
        format.js
      end
    else
      render partial: "schedule", locals: {schedules: @schedules}
    end
  end
end
