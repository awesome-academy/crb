class Api::MySchedulesController < ApplicationController
  def index
    @schedules = Schedule.my_schedule(current_user.id).order_start_time
                  .page(params[:my_page]).per Settings.per_page

    respond_to do |format|
      format.html {render partial: "schedule", locals: {schedules: @schedules}}
      format.js
    end
  end
end
