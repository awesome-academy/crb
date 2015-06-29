class Api::SharedSchedulesController < ApplicationController
  def index
    @schedules = Schedule.shared_schedules_future(current_user.id).order_start_time
                  .page(params[:shared_page]).per Settings.per_page

    respond_to do |format|
      format.html {render partial: "schedule", locals: {schedules: @schedules}}
      format.js
    end
  end
end
