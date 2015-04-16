class Admin::SchedulesController < Admin::BaseController
  before_action :get_schedule_to_day, only: [:index]

  def index
    @schedules = Schedule.paginate page: params[:page], per_page: 10
  end

  private
  def schedule_params
    params.require(:schedule).permit :state
  end

  def get_schedule_to_day
    @feed_items = Schedule.today_schedule
  end
end