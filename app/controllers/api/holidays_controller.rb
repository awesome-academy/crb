class Api::HolidaysController < ApplicationController
  def index
    load_holidays
    respond_to do |format|
      format.json {render json: {holidays: @holidays}, status: :ok}
    end
  end

  private
  def load_holidays
    from = Date.parse params[:start_date_range]
    to = Date.parse params[:end_date_range]
    @holidays = Holiday.in_range from, to
  end
end
