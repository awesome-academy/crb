class Admin::SchedulesController < Admin::BaseController
  respond_to :html, :js

  def index
    @schedules = Schedule.paginate page: params[:page], per_page: 10
    @today_schedules = Schedule.today_schedule
  end

  def update
    @schedule = Schedule.find params[:id]
    @schedule.update_attributes state: params[:state]
  end

  private
  def schedule_params
    params.require(:schedule).permit :state
  end
end
