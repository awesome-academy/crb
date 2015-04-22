class Admin::SchedulesController < Admin::BaseController
  before_action :get_schedule_to_day, only: [:index]
  respond_to :html, :js

  def index
    @schedules = Schedule.paginate page: params[:page], per_page: 10
  end

  def update
    @schedule = Schedule.find params[:id]
    @schedule.update_attributes state: params[:state]
  end

  private
  def schedule_params
    params.require(:schedule).permit :state
  end

  def get_schedule_to_day
    @schedules = Schedule.today_schedule
  end
end